import { notFound } from "next/navigation";
import Markdown from "@/components/ui/markdown/Markdown";
import { getDocBySlug, getDocContent } from "@/packages/hooks/useDocs";

interface Props {
  slug: string[];
}

const DocsTemplate = async ({ slug }: Props) => {
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const markdown = getDocContent(doc);

  return (
    <div className="docs-page">
      <div className="docs-page-header">
        <h1>{doc.title}</h1>
        {doc.description && (
          <p className="docs-page-description">{doc.description}</p>
        )}
      </div>

      <Markdown content={markdown} />
    </div>
  );
};

export default DocsTemplate;
