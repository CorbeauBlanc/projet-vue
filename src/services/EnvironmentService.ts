interface SharedVariables {
	api: string;
	processingApi: string;
	legacyUrl: string;
	nodeUrl: string;
}

interface DevVariables {
	forceLocalRoutes: boolean;
	forceDevRoutes: boolean;
	verbose: boolean;
}

export default class Environment {
	public static readonly instance: Environment = new Environment();

	public static get current():
		| 'development'
		| 'preproduction'
		| 'production'
		| '' {
		if (process.env['NODE_ENV'] === 'development') return 'development';
		if (
			process.env['NODE_ENV'] === 'preproduction' ||
			process.env['ENV_PREPRODUCTION']
		)
			return 'preproduction';
		return 'production';
	}

	public static any: SharedVariables = {
		api: process.env['VUE_APP_API'] || '',
		processingApi: process.env['VUE_APP_PROCESSING_API'] || '',
		legacyUrl: process.env['VUE_APP_LEGACY_URL'] || '',
		nodeUrl: process.env['VUE_APP_NODE_URL'] || '',
	};

	public static dev: DevVariables = {
		forceDevRoutes: process.env['VUE_APP_FORCE_DEV_ROUTES'] === 'true',
		forceLocalRoutes: process.env['VUE_APP_FORCE_LOCAL_ROUTES'] === 'true',
		verbose: process.env['VUE_APP_VERBOSE'] === 'true',
	};

	public static preprod: {} = {};

	public static prod: {} = {};

	private constructor() {
		return;
	}
}
