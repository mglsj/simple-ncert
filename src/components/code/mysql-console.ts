import "public/mysql/lib/libv86.js";

class MySQLConsole {
	emulator: any;

	constructor() {
		this.emulator = null;
	}

	async load(options) {
		return new Promise((resolve) => {
			const LOG_LINES = 1;
			let log_line_count = 0;
			let serial_out = "";

			this.emulator = new V86(options);
			// wait  for first n lines of output

			const startupHandler = (byte) => {
				const char = String.fromCharCode(byte);
				serial_out += char;

				if (serial_out.endsWith("\r\n")) {
					log_line_count++;
					if (log_line_count >= LOG_LINES) {
						resolve(true);
						this.emulator.remove_listener(
							"serial0-output-char",
							startupHandler,
						);
					}
					serial_out = "";
				}
			};

			this.emulator.add_listener("serial0-output-byte", startupHandler);

			// startup

			const startup = () => {
				setTimeout(() => {
					this.sendBackgroundCommands(["/etc/init.d/S40network restart"]);
					this.emulator.serial0_send("\\! reset\n");
				}, 0);
			};

			this.emulator.add_listener("emulator-ready", startup);
		});
	}

	sendBackgroundCommands(commands: string[]) {
		const filename = `${(Math.random() + 1).toString(36).substring(7)}.sh`;
		this.emulator.create_file(
			`/inbox/${filename}`,
			new TextEncoder().encode(commands.join("\n")),
		);
	}

	waitForOutput(skipLine = 1): Promise<string> {
		return new Promise((resolve) => {
			let serial_out = "";
			let output = "";
			let lines = 0;

			// Attach an event listener to the serial console
			const handleOutput = (byte) => {
				const char = String.fromCharCode(byte);
				serial_out += char;

				if (serial_out.endsWith("\r\n")) {
					lines++;
					// console.info(serial_out);
					if (lines > skipLine) {
						output += serial_out;
					}
					serial_out = "";
				} else if (serial_out.endsWith("mysql>")) {
					// Resolve the promise when processing is done
					resolve(output.trim());
					// Optionally, remove the event listener after receiving the event
					this.emulator.remove_listener("serial0-output-byte", handleOutput);
				}
			};
			// Add the event listener to the 'output' event
			this.emulator.add_listener("serial0-output-byte", handleOutput);
		});
	}

	async executeCommand(command: string) {
		this.emulator.serial0_send(`${command.trim().replaceAll("\n", " ")}\n`);
		const output = await this.waitForOutput();
		return output;
	}
}

async function loadMySQLConsole(src: string): Promise<MySQLConsole> {
	const options = {
		wasm_path: `${src}lib/v86.wasm`,
		memory_size: 128 * 1024 * 1024,
		filesystem: {
			basefs: `${src}filesystem/filesystem.json`,
			baseurl: `${src}filesystem/`,
		},
		network_relay_url: "wss://relay.widgetry.org/",
		autostart: true,
		disable_keyboard: true,
		disable_mouse: true,
		disable_speaker: true,
		acpi: true,
		initial_state: {
			url: `${src}state/v86state.bin.zst`,
		},
	};

	const mysqlConsole = new MySQLConsole();
	await mysqlConsole.load(options);
	return mysqlConsole;
}

export { loadMySQLConsole, type MySQLConsole };
