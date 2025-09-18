import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::index
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:46
* @route '/horizon/api/jobs/failed'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/horizon/api/jobs/failed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::index
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:46
* @route '/horizon/api/jobs/failed'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::index
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:46
* @route '/horizon/api/jobs/failed'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::index
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:46
* @route '/horizon/api/jobs/failed'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::show
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:101
* @route '/horizon/api/jobs/failed/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/horizon/api/jobs/failed/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::show
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:101
* @route '/horizon/api/jobs/failed/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::show
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:101
* @route '/horizon/api/jobs/failed/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \Laravel\Horizon\Http\Controllers\FailedJobsController::show
* @see vendor/laravel/horizon/src/Http/Controllers/FailedJobsController.php:101
* @route '/horizon/api/jobs/failed/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const FailedJobsController = { index, show }

export default FailedJobsController