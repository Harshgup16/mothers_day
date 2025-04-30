import ArticleClient from '@/app/articles/[id]/article-client'

interface ArticlePageProps {
  params: {
    id: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticleClient articleId={params.id} />
}
