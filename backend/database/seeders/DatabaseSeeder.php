<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ContentSeeder::class);

        $email = env('ADMIN_EMAIL', 'admin@example.com');
        $password = env('ADMIN_PASSWORD') ?: Str::password(16, symbols: false);

        $user = User::query()->firstOrCreate(
            ['email' => $email],
            ['name' => env('ADMIN_NAME', 'Site admin'), 'password' => $password],
        );

        if ($user->wasRecentlyCreated && ! env('ADMIN_PASSWORD')) {
            $this->command?->warn("Admin login: {$email} / {$password}  (change it after signing in)");
        }
    }
}
