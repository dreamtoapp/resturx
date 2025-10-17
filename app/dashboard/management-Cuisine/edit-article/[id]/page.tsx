import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { getCuisineArticle } from '../../actions/update-cuisine-article';
import CuisineArticleEditor from './components/CuisineArticleEditor';

export default async function CuisineArticleEditPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const cuisine = await getCuisineArticle(id);

  if (!cuisine) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <CuisineArticleEditor cuisine={cuisine} />
    </div>
  );
}

