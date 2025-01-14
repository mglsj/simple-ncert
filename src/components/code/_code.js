function waitForOutput(serialConsole) {
	return new Promise((resolve) => {
		var serial_out = "";
		var output = "";

		// Attach an event listener to the serial console
		function handleOutput(byte) {
			var char = String.fromCharCode(byte);
			serial_out += char;

			if (serial_out.endsWith("\r\n")) {
				console.info(serial_out);
				output += serial_out;

				serial_out = "";
			} else if (serial_out.endsWith("mysql>")) {
				// Resolve the promise when processing is done
				resolve(output);
				// Optionally, remove the event listener after receiving the event
				serialConsole.removeEventListener("serial0-output-byte", handleOutput);
			}
		}
		// Add the event listener to the 'output' event
		serialConsole.addEventListener("serial0-output-byte", handleOutput);
	});
}
