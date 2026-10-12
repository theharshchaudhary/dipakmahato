<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'subject' => ['required', 'string', 'max:190'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            // Honeypot: real visitors never see this field, bots fill it in.
            'website' => ['prohibited'],
            'ip' => ['nullable', 'ip'],
            'userAgent' => ['nullable', 'string', 'max:255'],
        ]);

        $message = ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            // The SSR server forwards the visitor's details; fall back to the direct caller.
            'ip_address' => $data['ip'] ?? $request->ip(),
            'user_agent' => $data['userAgent'] ?? substr((string) $request->userAgent(), 0, 255),
        ]);

        try {
            $to = SiteSetting::current()->email;
            Mail::raw(
                "From: {$message->name} <{$message->email}>\n\n{$message->message}",
                fn ($mail) => $mail->to($to)->replyTo($message->email, $message->name)
                    ->subject("[Website] {$message->subject}"),
            );
        } catch (Throwable $e) {
            // The message is saved in the admin panel either way; don't fail the visitor.
            Log::warning('Contact notification email failed', ['error' => $e->getMessage()]);
        }

        return response()->json(['ok' => true], 201);
    }
}
