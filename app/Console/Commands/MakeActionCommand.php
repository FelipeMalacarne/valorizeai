<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeActionCommand extends Command
{
    protected $signature = 'make:action {name} {--R|request : Create a request class too}';
    protected $description = 'Create a new Action class';

    public function handle(): void
    {
        $name = $this->argument('name');
        $this->createAction($name, $this->option('request'));

        if ($this->option('request')) {
            $this->createRequest($name);
        }

        $this->info('Action created successfully!');
    }

    private function createAction(string $name, bool $include_request): void
    {
        $requestParameter = $include_request ? "{class}Request \$request, " : "";

        $template = <<<EOT
<?php

declare(strict_types=1);

namespace App\Actions\\{namespace};

use App\Models\\{model};
{requestImport}

final class {class}
{
    /**
     * Handle the action.
     */
    public function handle({requestParam}{model} \${modelParam}): {returnType}
    {
{methodBody}
    }
}
EOT;

        $namespace = dirname($name);
        $class = basename($name);
        $model = str_replace(['Store', 'Update', 'Destroy', 'Show'], '', $class);
        $modelParam = Str::camel($model);

        if ($namespace === '.') {
            $namespace = '';
        }

        $returnType = $this->getReturnType($class, $model);
        $methodBody = $this->getMethodBody($class, $modelParam, $include_request);
        $requestImport = $include_request ? "use App\Http\Requests\\{namespace}\\{class}Request;" : "";

        $content = str_replace(
            ['{namespace}', '{class}', '{model}', '{modelParam}', '{returnType}', '{methodBody}', '{requestImport}', '{requestParam}'],
            [$namespace, $class, $model, $modelParam, $returnType, $methodBody, $requestImport, $requestParameter],
            $template
        );

        $path = app_path("Actions/{$name}.php");
        $this->ensureDirectoryExists($path);
        File::put($path, $content);
    }

    private function getReturnType(string $class, string $model): string
    {
        if (Str::startsWith($class, 'Destroy')) {
            return 'bool';
        }

        if (Str::startsWith($class, ['Index', 'Get'])) {
            return "\\Illuminate\\Database\\Eloquent\\Collection";
        }

        return "\\App\\Models\\{$model}";
    }

    private function getMethodBody(string $class, string $modelParam, bool $include_request): string
    {
        $request = $include_request ? '$request->validated()' : '[]';

        if (Str::startsWith($class, 'Destroy')) {
            return "        return \${$modelParam}->delete();";
        }

        if (Str::startsWith($class, 'Update')) {
            return "        \${$modelParam}->fill({$request})->save();\n\n        return \${$modelParam};";
        }

        if (Str::startsWith($class, 'Store')) {
            return "        return \\App\\Models\\".str_replace('Store', '', $class)."::create({$request});";
        }

        return "        // Add your action logic here\n        return \${$modelParam};";
    }

    private function createRequest(string $name): void
    {
        $path = app_path("Data/{$name}Data.php");
        $template = <<<EOT
<?php

declare(strict_types=1);

namespace App\\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class {$name}Data extends Data
{
    public function __construct(
        // Add your properties here
    ) {}

    public static function rules(): array
    {
        return [
            //
        ];
    }
}
EOT;

        $namespace = dirname($name);
        $class = basename($name);

        if ($namespace === '.') {
            $namespace = '';
        }

        $content = str_replace(
            ['{namespace}', '{class}'],
            [$namespace, $class],
            $template
        );

        $path = app_path("Http/Requests/{$name}Request.php");
        $this->ensureDirectoryExists($path);
        File::put($path, $content);
    }

    private function ensureDirectoryExists(string $path): void
    {
        $directory = dirname($path);
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
    }
}
