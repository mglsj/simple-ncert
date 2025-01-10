import type { Element, ElementContent, Root } from "hast";
import { toText } from "hast-util-to-text";
import {
	createMermaidRenderer,
	type CreateMermaidRendererOptions,
	type RenderOptions,
	type RenderResult,
} from "mermaid-isomorphic";
import svgToDataURI from "mini-svg-data-uri";
import { parse } from "space-separated-tokens";
import type { Plugin } from "unified";
import { visitParents } from "unist-util-visit-parents";

interface CodeInstance {
	/**
	 * The mermaid diagram.
	 */
	diagram: string;
	/**
	 * The inclusive ancestors of the element to process.
	 */
	ancestors: Element[];
}

/**
 * A regular expression to test for non-whitespace characters.
 */
const nonWhitespacePattern = /\w/;

/**
 * Check if a hast element has the `language-mermaid` class name.
 *
 * @param element
 *   The hast element to check.
 * @returns
 *   Whether or not the element has the `language-mermaid` class name.
 */
function isMermaidElement(element: Element): boolean {
	let mermaidClassName: string;

	if (element.tagName === "pre") {
		mermaidClassName = "mermaid";
	} else if (element.tagName === "code") {
		mermaidClassName = "language-mermaid";
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
	return className.includes(mermaidClassName);
}

/**
 * Convert a render result to a data URI.
 *
 * @param result
 *   The render result to turn into a data URI.
 * @param isSrcset
 *   Whether the result is for a `srcset` or a `src` attribute.
 * @returns
 *   The data URI.
 */
function toDataURI(result: RenderResult, isSrcset?: boolean): string {
	if (result.screenshot) {
		return `data:image/png;base64,${result.screenshot.toString("base64")}`;
	}

	return isSrcset
		? svgToDataURI.toSrcset(result.svg)
		: svgToDataURI(result.svg);
}

/**
 * Convert a Mermaid render result to a hast element.
 *
 * @param light
 *   The light Mermaid render result.
 * @param dark
 *   The dark mermaid render result.
 * @returns
 *   Array of two image elements, one for the light theme and one for the dark theme.
 */
function toImageElement(
	light: RenderResult,
	dark: RenderResult,
): Array<Element> {
	const imgLight: Element = {
		type: "element",
		tagName: "img",
		properties: {
			alt: light.description || "",
			height: light.height,
			id: light.id,
			class: "mermaid-light",
			src: toDataURI(light),
			title: light.title,
			width: light.width,
		},
		children: [],
	};
	const imgDark: Element = {
		type: "element",
		tagName: "img",
		properties: {
			alt: dark.description || "",
			height: dark.height,
			id: dark.id,
			class: "mermaid-dark",
			src: toDataURI(dark),
			title: dark.title,
			width: dark.width,
		},
		children: [],
	};
	return [imgLight, imgDark];
}

export interface rephypeStarlightMermaidOptions
	extends CreateMermaidRendererOptions,
		Omit<RenderOptions, "screenshot"> {}

/**
 * A [rehype](https://rehype.js.org) plugin to render [mermaid](https://mermaid-js.github.io)
 * diagrams with Astro Starlight compatible light and dark modes.
 *
 * @param options
 *   Options that may be used to tweak the output.
 */
const rephypeStarlightMermaid: Plugin<
	[rephypeStarlightMermaidOptions?],
	Root
> = (options) => {
	// const strategy = validateStrategy(options?.strategy);
	const renderDiagrams = createMermaidRenderer(options);

	return (ast, file) => {
		const instances: CodeInstance[] = [];

		visitParents(ast, "element", (node, ancestors) => {
			if (!isMermaidElement(node)) {
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

			instances.push({
				diagram: toText(node, { whitespace: "pre" }),
				ancestors: inclusiveAncestors,
			});
		});

		// Nothing to do. No need to start a browser in this case.
		if (!instances.length) {
			return;
		}

		const promises = [
			renderDiagrams(
				instances.map((instance) => instance.diagram),
				{ ...options, screenshot: false },
			),
			renderDiagrams(
				instances.map((instance) => instance.diagram),
				{
					...options,
					screenshot: false,
					mermaidConfig: { theme: "dark" },
					prefix: `${options?.prefix || "mermaid"}-dark`,
				},
			),
		];

		return Promise.all(promises).then(([lightResults, darkResults]) => {
			for (const [index, instance] of instances.entries()) {
				const lightResult = lightResults[index];
				const darkResult = darkResults?.[index];
				let replacement:
					| ElementContent
					| Array<ElementContent>
					| null
					| undefined
					| void;

				if (lightResult.status === "rejected") {
				} else if (darkResult.status === "rejected") {
				} else {
					replacement = toImageElement(lightResult.value, darkResult?.value);
				}

				const { ancestors } = instance;
				const node = ancestors.at(-1)!;
				const parent = ancestors.at(-2)!;
				const nodeIndex = parent.children.indexOf(node);
				if (replacement) {
					(parent.children as Array<Element>).splice(
						nodeIndex,
						1,
						...((Array.isArray(replacement)
							? replacement
							: [replacement]) as Element[]),
					);
				} else {
					parent.children.splice(nodeIndex, 1);
				}
			}
		});
	};
};

export default rephypeStarlightMermaid;
