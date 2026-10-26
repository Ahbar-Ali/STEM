
import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type MathExpressionProps = {
  expression: string;
};

function MathExpression({ expression }: MathExpressionProps) {
  const html = useMemo(() => {
    let latex = expression.trim();

    // Remove enclosing math delimiters
    if (latex.startsWith("$$") && latex.endsWith("$$")) {
      latex = latex.slice(2, -2).trim();
    } else if (
      latex.startsWith("\\[") &&
      latex.endsWith("\\]")
    ) {
      latex = latex.slice(2, -2).trim();
    } else if (
      latex.startsWith("\\(") &&
      latex.endsWith("\\)")
    ) {
      latex = latex.slice(2, -2).trim();
    } else if (
      latex.startsWith("$") &&
      latex.endsWith("$")
    ) {
      latex = latex.slice(1, -1).trim();
    }

    // Normalize spacing and line breaks
    latex = latex
      .replace(/\r?\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return katex.renderToString(latex, {
      throwOnError: false,
      trust: false,
      strict: "ignore",
      output: "htmlAndMathml",
      displayMode: false,
    });
  }, [expression]);

  return (
    <span
      className="math-expression"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default MathExpression;
