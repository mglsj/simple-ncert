import type { Element, Root } from "hast";
import { h } from "hastscript";
import { toText } from "hast-util-to-text";
import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

function isPythonExecutableElement(element: Element): boolean {
	if (element.tagName === "pre" && element.children.length > 0) {
		const child = element.children[0] as Element;

		if (
			child.tagName === "code" &&
			child.properties.className &&
			((child.properties.className as string).includes("language-py") ||
				(child.properties.className as string).includes("language-python")) &&
			child.properties.metastring &&
			(child.properties.metastring as string).includes("exec")
		) {
			return true;
		}
	}

	return false;
}

function isOutputElement(element: Element): boolean {
	if (element.tagName === "pre" && element.children.length > 0) {
		const child = element.children[0] as Element;

		if (
			child.tagName === "code" &&
			child.properties.className &&
			(child.properties.className as string).includes("language-output")
		) {
			return true;
		}
	}

	return false;
}

const rehypeExecutablePython: Plugin<[], Root> = () => {
	return (ast, file) => {
		visitParents(ast, "element", (node, ancestors) => {
			if (!isPythonExecutableElement(node)) {
				return;
			}
			const parent = ancestors.at(-1) as Element;
			const nodeIndex = parent.children.indexOf(node);

			let output = "";

			for (let i = nodeIndex + 1; i < parent.children.length; i++) {
				if (
					parent.children[i].type === "element" &&
					!isOutputElement(parent.children[i] as Element)
				) {
					break;
				}

				if (isOutputElement(parent.children[i] as Element)) {
					output = toText(parent.children[i], { whitespace: "pre" });

					// remove the output node
					parent.children.splice(i, 1);

					break;
				}
			}

			const mode = (node.children[0].properties.metastring as string).includes(
				"exec=code",
			)
				? "code"
				: "interactive";

			parent.children.splice(
				nodeIndex,
				1,
				h("div", [
					h(
						"exec-py",
						{
							"data-lang": "py",
							"data-mode": mode,
						},
						[
							node,
							h("snippet", toText(node, { whitespace: "pre" })),
							h("output", output ? [h("pre", output)] : []),
						],
					),
				]),
			);
		});
	};
};

export default rehypeExecutablePython;
