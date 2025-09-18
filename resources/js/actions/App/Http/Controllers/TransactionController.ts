import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransactionController::index
* @see app/Http/Controllers/TransactionController.php:25
* @route '/transactions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::index
* @see app/Http/Controllers/TransactionController.php:25
* @route '/transactions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::index
* @see app/Http/Controllers/TransactionController.php:25
* @route '/transactions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransactionController::index
* @see app/Http/Controllers/TransactionController.php:25
* @route '/transactions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TransactionController::create
* @see app/Http/Controllers/TransactionController.php:47
* @route '/transactions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/transactions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::create
* @see app/Http/Controllers/TransactionController.php:47
* @route '/transactions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::create
* @see app/Http/Controllers/TransactionController.php:47
* @route '/transactions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransactionController::create
* @see app/Http/Controllers/TransactionController.php:47
* @route '/transactions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TransactionController::store
* @see app/Http/Controllers/TransactionController.php:62
* @route '/transactions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::store
* @see app/Http/Controllers/TransactionController.php:62
* @route '/transactions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::store
* @see app/Http/Controllers/TransactionController.php:62
* @route '/transactions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransactionController::show
* @see app/Http/Controllers/TransactionController.php:74
* @route '/transactions/{transaction}'
*/
export const show = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/transactions/{transaction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::show
* @see app/Http/Controllers/TransactionController.php:74
* @route '/transactions/{transaction}'
*/
show.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
        ? args.transaction.id
        : args.transaction,
    }

    return show.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::show
* @see app/Http/Controllers/TransactionController.php:74
* @route '/transactions/{transaction}'
*/
show.get = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransactionController::show
* @see app/Http/Controllers/TransactionController.php:74
* @route '/transactions/{transaction}'
*/
show.head = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TransactionController::edit
* @see app/Http/Controllers/TransactionController.php:88
* @route '/transactions/{transaction}/edit'
*/
export const edit = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/transactions/{transaction}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::edit
* @see app/Http/Controllers/TransactionController.php:88
* @route '/transactions/{transaction}/edit'
*/
edit.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
        ? args.transaction.id
        : args.transaction,
    }

    return edit.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::edit
* @see app/Http/Controllers/TransactionController.php:88
* @route '/transactions/{transaction}/edit'
*/
edit.get = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransactionController::edit
* @see app/Http/Controllers/TransactionController.php:88
* @route '/transactions/{transaction}/edit'
*/
edit.head = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TransactionController::update
* @see app/Http/Controllers/TransactionController.php:93
* @route '/transactions/{transaction}'
*/
export const update = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/transactions/{transaction}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TransactionController::update
* @see app/Http/Controllers/TransactionController.php:93
* @route '/transactions/{transaction}'
*/
update.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
        ? args.transaction.id
        : args.transaction,
    }

    return update.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::update
* @see app/Http/Controllers/TransactionController.php:93
* @route '/transactions/{transaction}'
*/
update.put = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TransactionController::update
* @see app/Http/Controllers/TransactionController.php:93
* @route '/transactions/{transaction}'
*/
update.patch = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\TransactionController::destroy
* @see app/Http/Controllers/TransactionController.php:102
* @route '/transactions/{transaction}'
*/
export const destroy = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/transactions/{transaction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TransactionController::destroy
* @see app/Http/Controllers/TransactionController.php:102
* @route '/transactions/{transaction}'
*/
destroy.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { transaction: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
        ? args.transaction.id
        : args.transaction,
    }

    return destroy.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::destroy
* @see app/Http/Controllers/TransactionController.php:102
* @route '/transactions/{transaction}'
*/
destroy.delete = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const TransactionController = { index, create, store, show, edit, update, destroy }

export default TransactionController