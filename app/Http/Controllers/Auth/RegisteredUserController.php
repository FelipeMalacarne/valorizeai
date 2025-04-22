<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\RegisterUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterUserRequest $request, RegisterUser $action): RedirectResponse
    {
        $user = $action->handle($request);
        logger($user);

        Auth::login($user);

        return to_route('dashboard');
    }
}
