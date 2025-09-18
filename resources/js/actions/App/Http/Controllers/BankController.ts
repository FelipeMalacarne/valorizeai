import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:13
* @route '/banks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/banks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:13
* @route '/banks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:13
* @route '/banks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BankController::index
* @see app/Http/Controllers/BankController.php:13
* @route '/banks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const BankController = { index }

export default BankController