<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class MakeActionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:action
                            {name : The name of the action to create}
                            {--namespace= : The namespace for the action (e.g. Account, User, etc.)}
                            {--without-request : Create action without a corresponding request class}
                            {--model= : The model to use for the action (e.g. Account, User, etc.)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new action class with an optional corresponding request';

    /**
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $files;

    /**
     * Create a new command instance.
     *
     * @param  \Illuminate\Filesystem\Filesystem  $files
     * @return void
     */
    public function __construct(Filesystem $files)
    {
        parent::__construct();

        $this->files = $files;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->argument('name');
        $namespace = $this->option('namespace');
        $withoutRequest = $this->option('wr');
        $model = $this->option('model');

        // Generate the action
        $this->generateAction($name, $namespace, $withoutRequest, $model);

        // Generate request if not skipped
        if (!$withoutRequest) {
            $this->generateRequest($name, $namespace);
            $this->info('Action and Request created successfully!');
        } else {
            $this->info('Action created successfully!');
        }

        return Command::SUCCESS;
    }

    /**
     * Generate a new action class.
     */
    protected function generateAction(string $name, ?string $namespace, bool $withoutRequest = false, ?string $model = null): void
    {
        $namespacePath = $namespace ? "/{$namespace}" : '';
        $namespaceStatement = $namespace ? "\\{$namespace}" : '';

        $actionPath = app_path("Actions{$namespacePath}/{$name}.php");
        $requestName = "{$name}Request";

        if ($this->files->exists($actionPath)) {
            $this->error("Action {$name} already exists!");
            return;
        }

        $this->makeDirectory($actionPath);

        $stub = $this->files->get($withoutRequest ? $this->getActionWithoutRequestStub() : $this->getActionStub());

        $modelClass = $model ?: 'Model';
        $modelNamespace = $model ? "use App\\Models\\{$model};\n" : '';

        $stub = str_replace(
            ['{{ namespace }}', '{{ namespaceStatement }}', '{{ class }}', '{{ requestClass }}', '{{ modelClass }}', '{{ modelNamespace }}'],
            ['App\\Actions' . $namespaceStatement, $namespaceStatement, $name, $requestName, $modelClass, $modelNamespace],
            $stub
        );

        $this->files->put($actionPath, $stub);

        $this->info("Action [{$actionPath}] created successfully.");
    }

    /**
     * Generate a new request class.
     */
    protected function generateRequest(string $name, ?string $namespace): void
    {
        $namespacePath = $namespace ? "/{$namespace}" : '';
        $namespaceStatement = $namespace ? "\\{$namespace}" : '';

        $requestName = "{$name}Request";
        $requestPath = app_path("Http/Requests{$namespacePath}/{$requestName}.php");

        if ($this->files->exists($requestPath)) {
            $this->error("Request {$requestName} already exists!");
            return;
        }

        $this->makeDirectory($requestPath);

        $stub = $this->files->get($this->getRequestStub());

        $stub = str_replace(
            ['{{ namespace }}', '{{ namespaceStatement }}', '{{ class }}'],
            ['App\\Http\\Requests' . $namespaceStatement, $namespaceStatement, $requestName],
            $stub
        );

        $this->files->put($requestPath, $stub);

        $this->info("Request [{$requestPath}] created successfully.");
    }

    /**
     * Get the stub file for the action.
     */
    protected function getActionStub(): string
    {
        return app_path('Console/stubs/action.stub');
    }

    /**
     * Get the stub file for an action without a request.
     */
    protected function getActionWithoutRequestStub(): string
    {
        return app_path('Console/stubs/action-without-request.stub');
    }

    /**
     * Get the stub file for the request.
     */
    protected function getRequestStub(): string
    {
        return app_path('Console/stubs/request.stub');
    }

    /**
     * Build the directory for the class if necessary.
     */
    protected function makeDirectory(string $path): string
    {
        if (!$this->files->isDirectory(dirname($path))) {
            $this->files->makeDirectory(dirname($path), 0755, true, true);
        }

        return $path;
    }
}
