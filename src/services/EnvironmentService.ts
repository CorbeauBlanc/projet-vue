interface SharedVariables {
	api: string;
}

interface DevVariables {
	forceDevRoutes: boolean;
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
		api: process.env['VUE_APP_API'] || ''
	};

	public static dev: DevVariables = {
		forceDevRoutes: process.env['VUE_APP_FORCE_DEV_ROUTES'] === 'true',
	};

	public static preprod: {} = {};

	public static prod: {} = {};

	private constructor() {
		return;
	}
}
