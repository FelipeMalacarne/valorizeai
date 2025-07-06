<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

final class MakePageCommand extends Command
{
    protected $signature = 'make:page {name : The name of the page to create (e.g. accounts/index)}';

    protected $description = 'Create a new Inertia.js page component';

    protected $files;

    public function __construct(Filesystem $files)
    {
        parent::__construct();

        $this->files = $files;
    }

    public function handle(): int
    {
        $name = $this->argument('name');

        $this->generatePage($name);

        return Command::SUCCESS;
    }

    protected function generatePage(string $name): void
    {
        $path = resource_path("js/pages/{$name}.tsx");

        if ($this->files->exists($path)) {
            $this->error("Page {$name} already exists!");

            return;
        }

        $this->makeDirectory($path);

        $stub = $this->files->get($this->getPageStub());

        $className = Str::studly(str_replace('/', ' ', $name));
        $title = Str::headline(class_basename($name));
        $breadcrumbTitle = Str::plural(Str::headline(dirname($name)));
        $breadcrumbRoute = mb_strtolower(Str::plural(dirname($name))).'.index';
        $breadcrumbChildTitle = $title;
        $breadcrumbChildRoute = mb_strtolower(Str::plural(dirname($name))).'.'.mb_strtolower(Str::kebab(class_basename($name)));

        $stub = str_replace(
            ['{{className}}', '{{title}}', '{{breadcrumbTitle}}', '{{breadcrumbRoute}}', '{{breadcrumbChildTitle}}', '{{breadcrumbChildRoute}}'],
            [$className, $title, $breadcrumbTitle, $breadcrumbRoute, $breadcrumbChildTitle, $breadcrumbChildRoute],
            $stub
        );

        $this->files->put($path, $stub);

        $this->info("Page [{$path}] created successfully.");
    }

    protected function getPageStub(): string
    {
        return app_path('Console/stubs/inertia-page.stub');
    }

    protected function makeDirectory(string $path): string
    {
        if (! $this->files->isDirectory(dirname($path))) {
            $this->files->makeDirectory(dirname($path), 0755, true, true);
        }

        return $path;
    }
}
