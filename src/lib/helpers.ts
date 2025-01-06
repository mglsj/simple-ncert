import crypto from "node:crypto";

const generateRandomId = (): string =>
	crypto.randomUUID({ disableEntropyCache: true });

export { generateRandomId };
