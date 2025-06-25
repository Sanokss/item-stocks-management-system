<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Head Kitchen',
            'email' => 'kitchen@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'head-kitchen',
        ]);

        User::create([
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => bcrypt('admin123'),
            'role' => 'owner',
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin123'),
            'role' => 'owner',
        ]);
    }
}
