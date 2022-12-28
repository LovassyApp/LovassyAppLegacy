<?php

namespace App\Helpers\Warden\Cache;

use App\Helpers\Warden\Interfaces\Permission;
use App\Helpers\Warden\Interfaces\ColdCacheWriter;
use Exception;
use Spatie\LaravelIgnition\Support\Composer\ComposerClassMap;
use Str;

/**
 * The default 'Cold' cache builder implementation for Warden
 * @package Warden
 */
class ColdCacheBuilder extends ColdCacheWriter
{
    /**
     * Resolved Permissions and their PermissionStrings
     *
     * @var array
     */
    private array $permission_resolutions = [];

    /**
     * The same as 'permission_resolutions', but the key-value pairs are flipped
     *
     * @var array
     */
    private array $permission_resolutions_flipped = [];

    /**
     * Permission scopes, and all of their permissions
     *
     * @var array
     */
    private array $scope_cache = [];

    /**
     * The array of autoloaded Permission classes
     *
     * @var array
     */
    public readonly array $classes;

    /**
     * Autoloads the classes from the configured namespace
     *
     * @return array
     */
    private static function getClasses(): array
    {
        $namespaces = array_keys((new ComposerClassMap())->listClasses());
        return array_filter($namespaces, function ($item) {
            return Str::startsWith($item, config('warden.permission_namespace'));
        });
    }

    /**
     * Processes a given autoloaded class
     *
     * @param string $class_name
     * @return void
     */
    public function processClass(string $class_name): void
    {
        $instance = new $class_name();

        if (!$instance instanceof Permission) {
            $basename = class_basename($class_name);
            $logMsg = "$basename is not a valid Permission. Skipping.";
            fwrite(STDERR, "\033[33m$logMsg");
            return;
        }

        $this->permission_resolutions[$instance->permissionString()] = $class_name;
        $this->permission_resolutions_flipped[$class_name] = $instance->permissionString();

        $scope = $instance->scope();

        if (!array_key_exists($scope, $this->scope_cache) || !is_array($this->scope_cache[$scope])) {
            $this->scope_cache[$scope] = [];
        }

        $this->scope_cache[$scope][] = (object) [
            'displayName' => $instance->name(),
            'permissionString' => $instance->permissionString(),
            'description' => $instance->description(),
            'permission' => $instance->identifier(),
            'errorMessage' => $instance->defaultErrorMessage(),
        ];

        return;
    }

    /**
     * Random constructor, which runs the autoloader on startup
     */
    public function __construct()
    {
        $this->classes = $this->getClasses();
    }

    /**
     * Generates the 'Cold' cache file for Warden to load later
     *
     * @return string
     */
    private function generate_output(): string
    {
        $arr = [
            'permission_resolutions' => $this->permission_resolutions,
            'permission_resolutions_flipped' => $this->permission_resolutions_flipped,
            'scope_cache' => $this->scope_cache,
        ];

        $header = '<?php';

        return $header . PHP_EOL . 'return ' . var_export($arr, true) . ';' . PHP_EOL;
    }

    /**
     * Writes the 'Cold' cache file to the configured location
     *
     * @return void
     */
    public function write(): void
    {
        $path = storage_path(config('warden.cache_foler'));

        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        ob_start();

        $handle = fopen(config('warden.cache_path'), 'w');
        fwrite($handle, $this->generate_output());
        fclose($handle);

        if (!ob_end_flush()) {
            throw new Exception('Writing cache failed');
        }
    }

    /**
     * A Helper function for calling rebuild in one step.
     *
     * @return void
     */
    public static function rebuild(): void
    {
        $builder = new ColdCacheBuilder();
        foreach ($builder->classes as $class) {
            $builder->processClass($class);
        }
        $builder->write();
        return;
    }
}
