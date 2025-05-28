<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!in_array($request->user()->role, $roles)) {
            if ($request->user()->role == 'owner') {
                return redirect()->route('owner.dashboard');
            } else if ($request->user()->role == 'head-kitchen') {
                return redirect()->route('kitchen.dashboard');
            }

            return redirect('dashboard');
        }
        return $next($request);
    }
}
