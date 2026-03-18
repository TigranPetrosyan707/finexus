<?php

namespace App\Services;

use Stripe\StripeClient;

class StripeService
{
    public function client(): StripeClient
    {
        $secret = config('services.stripe.secret');
        if (empty($secret)) {
            throw new \RuntimeException('Stripe secret key is not configured.');
        }

        return new StripeClient($secret);
    }
}

