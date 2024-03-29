import '../components/PrismCustom'
import '../styles/main.scss'

import { MDXProvider } from '@mdx-js/react'
import dayjs from 'dayjs'
import { graphql, Link, PageProps } from 'gatsby'
import Highlight, { defaultProps } from 'prism-react-renderer'
import vsDark from 'prism-react-renderer/themes/vsDark'
import React from 'react'
import Helmet from 'react-helmet'

import { Navbar } from '../components'

import Ogp from '../components/Ogp'

const CodeBlock: React.FC = (props) => {
  const codeProps = props.children.props
  const codeString = codeProps.children.trim()
  const language = /language-(\w+)/.exec(codeProps.className)?.[1]
  return (
    <Highlight {...defaultProps} code={codeString} language={language} theme={vsDark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

interface TableOfContentsItem {
  url: string
  title: string
  items?: TableOfContentsItem[]
}
interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  return (
    <ul className='menu-list' data-label='tableOfContents'>
      {items?.map((item, index) => (
        <li key={index} data-label='tableOfContentsItem'>
          <Link to={item.url}>{item.title}</Link>
          {item.items != null ? <TableOfContents items={item.items} /> : ''}
        </li>
      ))}
    </ul>
  )
}

const EntryPageLayout: React.FC<PageProps<Queries.GetEntryPageQuery>> = ({
  data: { mdx },
  children,
}) => {
  const frontmatter = mdx?.frontmatter
  const tableOfContents = mdx?.tableOfContents

  const date = frontmatter?.date != null ? dayjs(frontmatter?.date).format('YYYY-MM-DD') : ''
  const updated =
    frontmatter?.updated != null ? dayjs(frontmatter?.updated).format('YYYY-MM-DD') : ''

  return (
    <>
      <Helmet>
        <title>{frontmatter?.title} · えやみぐさ</title>
        {frontmatter?.noindex ? (
          <>
            <meta name='robots' content='noindex' />
            <meta name='referrer' content='no-referrer' />
          </>
        ) : (
          ''
        )}
      </Helmet>
      {mdx != null ? <Ogp post={mdx} /> : ''}
      <Navbar />
      <div className='section'>
        <main className='container'>
          <aside data-label='meta'>
            <div className='columns m-0'>
              <div className='column m-0 p-0 is-size-7' data-label='dateString'>
                {date || updated ? (
                  <>
                    [<span data-label='dateCreated'>{date}</span>
                    {date && updated ? ' / ' : ''}
                    <span data-label='dateUpdated'>{updated}</span>]
                  </>
                ) : (
                  ''
                )}
              </div>
              <div className='column m-0 p-0 is-size-7 has-text-right'>
                <a
                  href={`https://github.com/aoirint/blog.aoirint.com-contents/edit/main/src/${mdx.fields.slug}index.md`}
                  className='mx-1'
                >
                  編集
                </a>
                <a
                  href={`https://github.com/aoirint/blog.aoirint.com-contents/tree/main/src/${mdx.fields.slug}index.md`}
                  className='mx-1'
                >
                  ソース
                </a>
                <a
                  href={`https://github.com/aoirint/blog.aoirint.com-contents/commits/main/src/${mdx.fields.slug}index.md`}
                  className='mx-1'
                >
                  履歴
                </a>
              </div>
            </div>
            <div className='is-size-7' data-label='tags'>
              {frontmatter?.channel != null ? (
                <>
                  <Link
                    to={`/channel/${frontmatter?.channel}/`}
                    className='mr-2'
                    data-label='channel'
                  >
                    {frontmatter?.channel}
                  </Link>
                  <span className='mr-2'>|</span>
                </>
              ) : (
                ''
              )}
              {frontmatter?.category != null ? (
                <>
                  <Link
                    to={`/channel/${frontmatter?.channel}/category/${frontmatter?.category}/`}
                    className='mr-2'
                    data-label='category'
                  >
                    {frontmatter?.category}
                  </Link>
                  <span className='mr-2'>|</span>
                </>
              ) : (
                ''
              )}
              {frontmatter?.tags?.map((tag) => (
                <Link
                  key={tag}
                  to={`/channel/${frontmatter?.channel}/tags/${tag}/`}
                  className='mr-2'
                  data-label='tag'
                >
                  {tag}
                </Link>
              ))}
            </div>
          </aside>
          <hr className='my-2' />
          <div className='mt-2'>
            <nav className='is-hidden-desktop menu'>
              {tableOfContents != null ? <TableOfContents items={tableOfContents.items} /> : ''}
            </nav>
            <div className='is-flex-desktop mt-4'>
              <article className='content is-rest-w300-desktop' data-label='article'>
                <MDXProvider
                  components={{
                    pre: CodeBlock,
                  }}
                >
                  {children}
                </MDXProvider>
              </article>
              <nav
                className='is-hidden-touch is-w300-desktop menu'
                style={{
                  position: 'sticky',
                  top: '64px',
                  maxHeight: 'calc(100vh - 64px)',
                  overflowY: 'auto',
                }}
              >
                {tableOfContents != null ? <TableOfContents items={tableOfContents.items} /> : ''}
              </nav>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query GetEntryPage($id: String) {
    mdx(id: { eq: $id }) {
      id
      fields {
        slug
      }
      excerpt
      tableOfContents
      frontmatter {
        title
        date
        updated
        noindex
        channel
        category
        tags
      }
    }
  }
`

export default EntryPageLayout
