class JsonResponse extends Response {
	constructor(body?: Record<string, unknown>, status = 200, init?: ResponseInit) {
		super(JSON.stringify({ ...body }), {
			...init,
			status: status
		});
	}
}

export default JsonResponse;
