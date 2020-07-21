import React, { useState, useEffect, useRef } from 'react'
import styles from './SnippetTab.styl'
import CSSModules from 'browser/lib/CSSModules'
import dataApi from 'browser/main/lib/dataApi'
import i18n from 'browser/lib/i18n'
import eventEmitter from 'browser/main/lib/eventEmitter'
import context from 'browser/lib/context'

const SnippetList = ({ onSnippetSelect, currentSnippet, onSnippetDeleted }) => {
  const [snippets, setSnippets] = useState([])
  const snippetListRef = useRef(null)

  useEffect(() => {
    reloadSnippetList()
    eventEmitter.on('snippetList:reload', reloadSnippetList)
  }, [])

  const reloadSnippetList = () => {
    dataApi.fetchSnippet().then(snippets => {
      setSnippets(snippets)
      onSnippetSelect(currentSnippet)
    })
  }

  const handleSnippetContextMenu = (snippet) => {
    context.popup([
      {
        label: i18n.__('Delete snippet'),
        click: () => deleteSnippet(snippet)
      }
    ])
  }

  const deleteSnippet = (snippet) => {
    dataApi
      .deleteSnippet(snippet)
      .then(() => {
        reloadSnippetList()
        onSnippetDeleted(snippet)
      })
      .catch(err => {
        throw err
      })
  }

  const handleSnippetClick = (snippet) => {
    onSnippetSelect(snippet)
  }

  const createSnippet = () => {
    dataApi
      .createSnippet()
      .then(() => {
        reloadSnippetList()
        // scroll to end of list when added new snippet
        const snippetList = document.getElementById('snippets')
        snippetListRef.scrollTop = snippetList.scrollHeight
      })
      .catch(err => {
        throw err
      })
  }

  const defineSnippetStyleName = (snippet) => {
    if (!currentSnippet) {
      return 'snippet-item'
    }

    if (currentSnippet.id === snippet.id) {
      return 'snippet-item-selected'
    } else {
      return 'snippet-item'
    }
  }

  return (
    <div styleName='snippet-list'>
      <div styleName='group-section'>
        <div styleName='group-section-control'>
          <button
            styleName='group-control-button'
            onClick={createSnippet}
          >
            <i className='fa fa-plus' /> {i18n.__('New Snippet')}
          </button>
        </div>
      </div>
      <ul ref={snippetListRef} styleName='snippets'>
        {snippets.map(snippet => (
          <li
            styleName={defineSnippetStyleName(snippet)}
            key={snippet.id}
            onContextMenu={() => handleSnippetContextMenu(snippet)}
            onClick={() => handleSnippetClick(snippet)}
          >
            {snippet.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CSSModules(SnippetList, styles)
