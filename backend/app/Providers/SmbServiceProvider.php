<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Icewind\SMB\Server;
use Icewind\SMB\Server\ServerFactory;
use Icewind\SMB\Server\Directory;

class SmbServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('filesystem.smb', function ($app) {
            $config = $app['config']['filesystems.disks.smb'];
            $serverFactory = new ServerFactory();
            $server = $serverFactory->create($config['host'], $config['username'], $config['password']);
            return $server->get($config['root']);
        });
    }

    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
