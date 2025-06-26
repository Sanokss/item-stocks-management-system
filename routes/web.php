<?php

use App\Http\Controllers\Owner\DashboardController;
use App\Http\Controllers\Owner\BarangKeluarController;
use App\Http\Controllers\Owner\BarangMasukController;
use App\Http\Controllers\HeadKitchen\DashboardController as KitchenDashboardController;
use App\Http\Controllers\Owner\BarangController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Check if user is authenticated
    if (auth()->check()) {
        $user = auth()->user();

        // Redirect based on user role
        switch ($user->role) {
            case 'owner':
                return redirect()->route('owner.dashboard');
            case 'head-kitchen':
                return redirect()->route('kitchen.dashboard');
            default:
                return redirect()->route('dashboard');
        }
    }

    // If not authenticated, show welcome page
    return Inertia::render('Auth/Login');
});


Route::middleware(['auth', 'role:owner'])->group(function () {
    Route::get('/owner/dashboard', [DashboardController::class, 'index'])->name('owner.dashboard');

    // Barang Routes
    Route::get('/owner/barang', [BarangController::class, 'index'])->name('owner.barang.index');
    Route::get('/owner/barang/create', [BarangController::class, 'create'])->name('owner.barang.create');
    Route::post('/owner/barang', [BarangController::class, 'store'])->name('owner.barang.store');
    Route::get('/owner/barang/{id}/edit', [BarangController::class, 'edit'])->name('owner.barang.edit');
    Route::patch('/owner/barang/{id}', [BarangController::class, 'update'])->name('owner.barang.update');
    Route::delete('/owner/barang/{id}', [BarangController::class, 'destroy'])->name('owner.barang.destroy');
    Route::get('/owner/barang/cetak', [BarangController::class, 'cetak'])->name('owner.barang.cetak');
    Route::post('/owner/barang/export-excel', [BarangController::class, 'exportExcel'])->name('owner.barang.export-excel');
    Route::post('/export-pdf', [BarangController::class, 'exportPdf'])->name('owner.barang.export-pdf');
    Route::get('/stock-check', [BarangController::class, 'checkLowStock'])->name('owner.barang.stock-check');


    // Barang Masuk Routes
    Route::get('/owner/barang-masuk', [BarangMasukController::class, 'index'])->name('owner.barang-masuk.index');
    Route::get('/owner/barang-masuk/create', [BarangMasukController::class, 'create'])->name('owner.barang-masuk.create');
    Route::post('/owner/barang-masuk', [BarangMasukController::class, 'store'])->name('owner.barang-masuk.store');
    Route::get('/owner/barang-masuk/{id}/edit', [BarangMasukController::class, 'edit'])->name('owner.barang-masuk.edit');
    Route::put('/owner/barang-masuk/{id}', [BarangMasukController::class, 'update'])->name('owner.barang-masuk.update');
    Route::delete('/owner/barang-masuk/{id}', [BarangMasukController::class, 'destroy'])->name('owner.barang-masuk.destroy');
    Route::get('/owner/barang-masuk/cetak', [BarangMasukController::class, 'cetak'])->name('owner.barang-masuk.cetak');
    Route::post('/owner/barang-masuk/export-excel', [BarangMasukController::class, 'exportExcel'])->name('owner.barang-masuk.export-excel');

    // Barang Keluar Routes
    Route::get('/owner/barang-keluar', [BarangKeluarController::class, 'index'])->name('owner.barang-keluar.index');
    Route::get('/owner/barang-keluar/create', [BarangKeluarController::class, 'create'])->name('owner.barang-keluar.create');
    Route::post('/owner/barang-keluar', [BarangKeluarController::class, 'store'])->name('owner.barang-keluar.store');
    Route::get('/owner/barang-keluar/{id}/edit', [BarangKeluarController::class, 'edit'])->name('owner.barang-keluar.edit');
    Route::put('/owner/barang-keluar/{id}', [BarangKeluarController::class, 'update'])->name('owner.barang-keluar.update');
    Route::delete('/owner/barang-keluar/{id}', [BarangKeluarController::class, 'destroy'])->name('owner.barang-keluar.destroy');
    Route::get('/owner/barang-keluar/cetak', [BarangKeluarController::class, 'cetak'])->name('owner.barang-keluar.cetak');
    Route::post('/owner/barang-keluar/export-excel', [BarangKeluarController::class, 'exportExcel'])->name('owner.barang-keluar.export-excel');
});

Route::middleware(['auth', 'role:head-kitchen'])->group(function () {
    Route::get('/kitchen/dashboard', [KitchenDashboardController::class, 'index'])->name('kitchen.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
