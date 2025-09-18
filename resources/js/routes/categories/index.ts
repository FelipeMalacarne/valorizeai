import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CategoryController::index
* @see app/Http/Controllers/CategoryController.php:25
* @route '/categories'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoryController::index
* @see app/Http/Controllers/CategoryController.php:25
* @route '/categories'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryController::index
* @see app/Http/Controllers/CategoryController.php:25
* @route '/categories'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoryController::index
* @see app/Http/Controllers/CategoryController.php:25
* @route '/categories'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoryController::store
* @see app/Http/Controllers/CategoryController.php:34
* @route '/categories'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoryController::store
* @see app/Http/Controllers/CategoryController.php:34
* @route '/categories'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryController::store
* @see app/Http/Controllers/CategoryController.php:34
* @route '/categories'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoryController::show
* @see app/Http/Controllers/CategoryController.php:43
* @route '/categories/{category}'
*/
export const show = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoryController::show
* @see app/Http/Controllers/CategoryController.php:43
* @route '/categories/{category}'
*/
show.url = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: typeof args.category === 'object'
        ? args.category.id
        : args.category,
    }

    return show.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryController::show
* @see app/Http/Controllers/CategoryController.php:43
* @route '/categories/{category}'
*/
show.get = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoryController::show
* @see app/Http/Controllers/CategoryController.php:43
* @route '/categories/{category}'
*/
show.head = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoryController::update
* @see app/Http/Controllers/CategoryController.php:52
* @route '/categories/{category}'
*/
export const update = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CategoryController::update
* @see app/Http/Controllers/CategoryController.php:52
* @route '/categories/{category}'
*/
update.url = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: typeof args.category === 'object'
        ? args.category.id
        : args.category,
    }

    return update.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryController::update
* @see app/Http/Controllers/CategoryController.php:52
* @route '/categories/{category}'
*/
update.put = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CategoryController::update
* @see app/Http/Controllers/CategoryController.php:52
* @route '/categories/{category}'
*/
update.patch = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CategoryController::destroy
* @see app/Http/Controllers/CategoryController.php:63
* @route '/categories/{category}'
*/
export const destroy = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CategoryController::destroy
* @see app/Http/Controllers/CategoryController.php:63
* @route '/categories/{category}'
*/
destroy.url = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { category: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        category: typeof args.category === 'object'
        ? args.category.id
        : args.category,
    }

    return destroy.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoryController::destroy
* @see app/Http/Controllers/CategoryController.php:63
* @route '/categories/{category}'
*/
destroy.delete = (args: { category: string | { id: string } } | [category: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const categories = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default categories