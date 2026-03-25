# Plugins

The plugin system lets you extend No.JS with reusable packages -- analytics, auth, feature flags, UI libraries -- without modifying the core framework.

## Registration

```html
<script>
  // Object form
  NoJS.use({
    name: 'analytics',
    version: '1.0.0',
    capabilities: ['interceptors', 'globals'],

    install(app, options) {
      // Called synchronously by NoJS.use()
      app.global('analytics', { pageViews: 0 });

      app.interceptor('response', (response, url) => {
        console.log('API call:', url, response.status);
        return response;
      });
    },

    init(app) {
      // Called after NoJS.init() — DOM is ready
      console.log('Analytics ready');
    },

    dispose(app) {
      // Called during NoJS.dispose()
      console.log('Analytics disposed');
    }
  });

  // Function shorthand (named functions only)
  function myLogger(app, options) {
    app.interceptor('request', (url, opts) => {
      console.log(`[${options.prefix || 'LOG'}]`, url);
      return opts;
    });
  }

  NoJS.use(myLogger, { prefix: 'API' });
</script>
```

## Plugin Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique identifier |
| `version` | string | No | Semver string for debugging |
| `capabilities` | string[] | No | Declared capabilities (logged in debug mode) |
| `install` | function(app, options) | Yes | Called synchronously by `NoJS.use()` |
| `init` | function(app) | No | Called after `NoJS.init()` (async allowed) |
| `dispose` | function(app) | No | Called during `NoJS.dispose()` (async, 3s timeout) |

## Lifecycle

```
NoJS.use(plugin)     ->  plugin.install(app, options)
NoJS.init()          ->  ... DOM processed ...  ->  plugin.init(app)
NoJS.dispose()       ->  plugin.dispose(app)  ->  ... teardown ...
```

- `install` runs immediately and synchronously
- `init` runs after DOM is processed, router is active
- `dispose` runs in reverse installation order with 3-second timeout per plugin
- After all `init` hooks: `plugins:ready` event is emitted

---

## Reactive Globals

```html
<script>
  NoJS.global('theme', { mode: 'dark', accent: 'blue' });
  NoJS.global('apiVersion', '2.1');
</script>

<!-- Access with $ prefix -->
<span bind="$theme.mode"></span>
<button on:click="$theme.mode = $theme.mode === 'dark' ? 'light' : 'dark'">
  Toggle Theme
</button>
<span bind="$apiVersion"></span>
```

### Reserved Names

Cannot be used: `store`, `route`, `router`, `i18n`, `refs`, `form`, `parent`, `watch`, `set`, `notify`, `raw`, `isProxy`, `listeners`, `app`, `config`, `env`, `debug`, `version`, `plugins`, `globals`, `el`, `event`, `self`, `this`, `super`, `window`, `document`, `toString`, `valueOf`, `hasOwnProperty`

Also blocked: `__proto__`, `constructor`, `prototype`

### Reactivity

Objects passed to `NoJS.global()` are wrapped in a reactive context automatically. Mutations trigger DOM updates:

```html
<script>
  NoJS.global('user', { name: 'Guest', role: 'viewer' });
</script>

<span bind="$user.name"></span>
<button on:click="$user.name = 'John'">Set Name</button>
```

---

## Interceptor Sentinels

### Cancel a Request

```html
<script>
  NoJS.use({
    name: 'offline-guard',
    install(app) {
      app.interceptor('request', (url, opts) => {
        if (!navigator.onLine) {
          return { [app.CANCEL]: true };
        }
        return opts;
      });
    }
  });
</script>
```

### Short-Circuit with Cached Data

```html
<script>
  const cache = new Map();

  NoJS.use({
    name: 'cache-plugin',
    install(app) {
      app.interceptor('request', (url, opts) => {
        if (opts.method === 'GET' && cache.has(url)) {
          return { [app.RESPOND]: cache.get(url) };
        }
        return opts;
      });

      app.interceptor('response', (response, url) => {
        if (response.ok) cache.set(url, response);
        return response;
      });
    }
  });
</script>
```

### Replace Response Data

```html
<script>
  NoJS.use({
    name: 'transform',
    install(app) {
      app.interceptor('response', (response, url) => {
        if (url.includes('/users')) {
          return { [app.REPLACE]: { timestamp: Date.now(), source: url } };
        }
        return response;
      });
    }
  });
</script>
```

| Sentinel | Used In | Effect |
|----------|---------|--------|
| `NoJS.CANCEL` | Request interceptor | Aborts the request (throws AbortError) |
| `NoJS.RESPOND` | Request interceptor | Returns data directly, skips HTTP call |
| `NoJS.REPLACE` | Response interceptor | Replaces the parsed response body |

---

## Trusted Interceptors

By default, plugin interceptors receive redacted headers. Auth plugins that need real headers use `{ trusted: true }`:

```html
<script>
  NoJS.use(authPlugin, { trusted: true });
</script>
```

**Redacted request headers:** `authorization`, `x-api-key`, `x-auth-token`, `cookie`, `proxy-authorization`, `set-cookie`, `x-csrf-token`

> Headers matching the pattern `x-auth-*` or `x-api-*` are also redacted.

**Redacted response headers:** `set-cookie`, `x-csrf-token`, `x-auth-token`, `www-authenticate`, `proxy-authenticate`

> Headers matching the pattern `x-auth-*` or `x-api-*` are also redacted.

---

## App Teardown

```html
<script>
  await NoJS.dispose();
</script>
```

1. Plugins disposed in **reverse** installation order
2. Each plugin's `dispose` has a **3-second timeout**
3. Globals and interceptors cleared after all plugins dispose
4. `NoJS.init()` can be called again after disposal

---

## Directive Freezing

Core directives are frozen after framework load. Plugins can add new directives but cannot override built-ins:

```html
<script>
  NoJS.use({
    name: 'charts',
    install(app) {
      app.directive('chart', {             // OK — new directive
        priority: 25,
        init(el, name, value) { /* ... */ }
      });
      app.directive('bind', { /* ... */ }); // Warning — core directive, ignored
    }
  });
</script>
```

---

## Security Best Practices

1. **Namespace globals** — use plugin name as prefix: `$analytics`, `$auth`
2. **Never use eval/Function** — rejected by `NoJS.global()`
3. **Clean up in dispose** — clear intervals, close connections
4. **Validate options** — check required config in `install` and warn early
5. **Use trusted sparingly** — only for plugins that need real header access

---

## Complete Example: Auth Plugin

```html
<script>
  const authPlugin = {
    name: 'auth',
    version: '1.0.0',
    capabilities: ['interceptors', 'stores'],

    install(app, options) {
      app.interceptor('request', (url, opts) => {
        const token = app.store.auth?.token;
        if (token) {
          opts.headers = opts.headers || {};
          opts.headers['Authorization'] = 'Bearer ' + token;
        }
        return opts;
      });

      app.interceptor('response', (response, url) => {
        if (response.status === 401) {
          app.store.auth.token = null;
          app.store.auth.user = null;
          app.notify();
          app.router?.push('/login');
        }
        return response;
      });
    }
  };

  NoJS.use(authPlugin, { trusted: true });
</script>
```

---

## TypeScript Support

Full TypeScript definitions for the plugin API are available in the framework at `types/nojs-plugin.d.ts`. This provides autocomplete and type checking for `NoJSPlugin`, `NoJSInstance`, interceptor signatures, and sentinel symbols.

---

**Next:** [Configuration & Security ->](configuration.md)
