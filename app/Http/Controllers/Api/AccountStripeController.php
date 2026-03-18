<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;

class AccountStripeController extends Controller
{
    public function publishableKey(): JsonResponse
    {
        return response()->json([
            'publishableKey' => config('services.stripe.key'),
        ]);
    }

    public function createSetupIntent(Request $request, StripeService $stripeService): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        try {
            $stripe = $stripeService->client();

            if (!config('services.stripe.key') || !config('services.stripe.secret')) {
                throw new \RuntimeException('Stripe keys are not configured.');
            }

            if (empty($user->stripe_customer_id)) {
                $customer = $stripe->customers->create([
                    'email' => $user->email,
                    'name' => $user->name,
                ]);

                $user->stripe_customer_id = $customer->id;
                $user->save();
            }

            $setupIntent = $stripe->setupIntents->create([
                'customer' => $user->stripe_customer_id,
                'usage' => 'off_session',
                'payment_method_types' => ['card'],
            ]);

            return response()->json([
                'clientSecret' => $setupIntent->client_secret,
            ]);
        } catch (ApiErrorException $e) {
            Log::warning('Stripe createSetupIntent failed', [
                'user_id' => $user?->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => 'Unable to create Stripe Setup Intent.',
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Stripe createSetupIntent unexpected failure', [
                'user_id' => $user?->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => 'Unable to create Stripe Setup Intent.',
            ], 500);
        }
    }

    public function saveCard(Request $request, StripeService $stripeService): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        try {
            $payload = $request->validate([
                'setupIntentId' => ['required', 'string'],
            ]);

            if (empty($user->stripe_customer_id)) {
                throw ValidationException::withMessages([
                    'stripeCustomer' => ['No Stripe customer associated with this account.'],
                ]);
            }

            $stripe = $stripeService->client();

            $setupIntent = $stripe->setupIntents->retrieve(
                $payload['setupIntentId'],
                ['expand' => ['payment_method']]
            );

            $customerIdFromIntent = $setupIntent->customer ?? null;
            if (!$customerIdFromIntent || $customerIdFromIntent !== $user->stripe_customer_id) {
                return response()->json([
                    'message' => 'Stripe Setup Intent does not belong to this customer.',
                ], 403);
            }

            if (($setupIntent->status ?? null) !== 'succeeded') {
                return response()->json([
                    'message' => 'Stripe Setup Intent is not completed yet.',
                ], 422);
            }

            $paymentMethod = $setupIntent->payment_method;
            $paymentMethodId = $paymentMethod->id ?? null;
            if (!$paymentMethodId) {
                return response()->json([
                    'message' => 'No payment method found on the Setup Intent.',
                ], 422);
            }

            // Ensure the payment method is attached and set as the default for future usage.
            try {
                $stripe->paymentMethods->attach($paymentMethodId, [
                    'customer' => $user->stripe_customer_id,
                ]);
            } catch (ApiErrorException $e) {
                // If it's already attached, Stripe will throw. We can safely continue.
                // (We still set defaults + store card fingerprint data below.)
            }

            $stripe->customers->update($user->stripe_customer_id, [
                'invoice_settings' => [
                    'default_payment_method' => $paymentMethodId,
                ],
            ]);

            $card = $paymentMethod->card ?? null;

            $user->stripe_payment_method_id = $paymentMethodId;
            $user->stripe_payment_brand = $card?->brand;
            $user->stripe_payment_last4 = $card?->last4;
            $user->stripe_payment_exp_month = $card?->exp_month;
            $user->stripe_payment_exp_year = $card?->exp_year;
            $user->save();

            return response()->json([
                'paymentMethod' => [
                    'id' => $user->stripe_payment_method_id,
                    'brand' => $user->stripe_payment_brand,
                    'last4' => $user->stripe_payment_last4,
                    'expMonth' => $user->stripe_payment_exp_month,
                    'expYear' => $user->stripe_payment_exp_year,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Invalid request data.',
                'errors' => $e->errors(),
            ], 422);
        } catch (ApiErrorException $e) {
            Log::warning('Stripe saveCard failed', [
                'user_id' => $user?->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => 'Unable to save card.',
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Stripe saveCard unexpected failure', [
                'user_id' => $user?->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => 'Unable to save card.',
            ], 500);
        }
    }
}

