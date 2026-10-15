<?php

namespace Tests\Feature;

use App\Filament\Pages\Auth\EditProfile;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use App\Support\UserSessions;
use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\ContentSeeder::class);
        $this->user = User::factory()->create(['password' => 'Original-Pass-123']);
        $this->actingAs($this->user);
    }

    public function test_profile_page_renders_with_all_sections(): void
    {
        $this->get('/admin/profile')
            ->assertOk()
            ->assertSee('Your details')
            ->assertSee('Two-factor authentication')
            ->assertSee('Where you&#039;re signed in', escape: false);
    }

    public function test_name_can_change_without_current_password(): void
    {
        Livewire::test(EditProfile::class)
            ->fillForm(['name' => 'Dipak K. Mahato'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('Dipak K. Mahato', $this->user->fresh()->name);
    }

    public function test_password_change_needs_current_password_and_a_strong_password(): void
    {
        Livewire::test(EditProfile::class)
            ->fillForm(['password' => 'short', 'passwordConfirmation' => 'short', 'currentPassword' => 'Original-Pass-123'])
            ->call('save')
            ->assertHasFormErrors(['password']);

        Livewire::test(EditProfile::class)
            ->fillForm(['password' => 'Brand-New-Pass-456', 'passwordConfirmation' => 'Brand-New-Pass-456', 'currentPassword' => 'wrong'])
            ->call('save')
            ->assertHasFormErrors(['currentPassword']);

        Livewire::test(EditProfile::class)
            ->fillForm(['password' => 'Brand-New-Pass-456', 'passwordConfirmation' => 'Brand-New-Pass-456', 'currentPassword' => 'Original-Pass-123'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertTrue(Hash::check('Brand-New-Pass-456', $this->user->fresh()->password));
    }

    public function test_signing_in_records_time_and_ip(): void
    {
        event(new Login('web', $this->user, false));

        $this->assertNotNull($this->user->fresh()->last_login_at);
        $this->assertNotNull($this->user->fresh()->last_login_ip);
    }

    public function test_other_sessions_can_be_ended_and_current_one_kept(): void
    {
        config(['session.driver' => 'database']);
        foreach (['current', 'phone', 'laptop'] as $id) {
            DB::table('sessions')->insert([
                'id' => $id, 'user_id' => $this->user->id, 'ip_address' => '10.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36',
                'payload' => '', 'last_activity' => now()->timestamp,
            ]);
        }

        $sessions = UserSessions::for($this->user, 'current');
        $this->assertCount(3, $sessions);
        $this->assertSame('Chrome on Windows', $sessions[0]['device']);

        $this->assertSame(2, UserSessions::endOthers($this->user, 'current'));
        $this->assertSame(['current'], DB::table('sessions')->pluck('id')->all());
    }

    public function test_admin_can_reset_someone_elses_two_factor(): void
    {
        $other = User::factory()->create();
        $other->saveAppAuthenticationSecret('JBSWY3DPEHPK3PXP');
        $other->saveAppAuthenticationRecoveryCodes(['code-1', 'code-2']);
        $this->assertTrue($other->fresh()->hasTwoFactorEnabled());

        Livewire::test(ListUsers::class)
            ->callAction(\Filament\Actions\Testing\TestAction::make('resetTwoFactor')->table($other));

        $this->assertFalse($other->fresh()->hasTwoFactorEnabled());
        $this->assertNull($other->fresh()->getAppAuthenticationRecoveryCodes());
    }

    public function test_two_factor_secret_is_encrypted_at_rest(): void
    {
        $this->user->saveAppAuthenticationSecret('JBSWY3DPEHPK3PXP');

        $raw = DB::table('users')->where('id', $this->user->id)->value('app_authentication_secret');
        $this->assertNotSame('JBSWY3DPEHPK3PXP', $raw);
        $this->assertSame('JBSWY3DPEHPK3PXP', $this->user->fresh()->getAppAuthenticationSecret());
    }
}
