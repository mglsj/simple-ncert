import type { Element, Root } from "hast";
import { h } from "hastscript";
import { toText } from "hast-util-to-text";
import { parse } from "space-separated-tokens";
import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

interface PythonExecutableProperties {
	metastring?: string;
	className?: string | string[];
}

function isPythonExecutableElement(element: Element): boolean {
	const properties = element.properties as
		| PythonExecutableProperties
		| undefined;

	if (
		!properties ||
		!properties.metastring ||
		!properties.metastring.includes("exec")
	) {
		return false;
	}

	let pythonClassName: string;

	if (element.tagName === "pre") {
		pythonClassName = "py";
	} else if (element.tagName === "code") {
		pythonClassName = "language-py";
	} else {
		return false;
	}

	let className = element.properties?.className;
	if (typeof className === "string") {
		className = parse(className);
	}
	if (!Array.isArray(className)) {
		return false;
	}
	return className.includes(pythonClassName);
}

const rehypeExecutablePython: Plugin<[], Root> = () => {
	return (ast, file) => {
		visitParents(ast, "element", (node, ancestors) => {
			if (!isPythonExecutableElement(node)) {
				return;
			}

			const parent = ancestors.at(-1)!;
			let inclusiveAncestors = ancestors as Element[];

			// This is <code> wrapped in a <pre> element.
			if (parent.type === "element" && parent.tagName === "pre") {
				for (const child of parent.children) {
					// We allow whitespace text siblings, but any other siblings mean we don’t process the
					// diagram.
					if (child.type === "text") {
						if (nonWhitespacePattern.test(child.value)) {
							return;
						}
					} else if (child !== node) {
						return;
					}
				}
			} else {
				inclusiveAncestors = [...inclusiveAncestors, node];
			}
			{
				const node = inclusiveAncestors.at(-1)!;
				const parent = inclusiveAncestors.at(-2)!;
				const nodeIndex = parent.children.indexOf(node);

				(parent.children as Array<Element>).splice(
					nodeIndex,
					1,
					h("div", [
						h("exec-py", [
							node,
							h("snippet", toText(node, { whitespace: "pre" })),
							h("output", []),
						]),
					]),
				);
			}
		});
	};
};

export default rehypeExecutablePython;
