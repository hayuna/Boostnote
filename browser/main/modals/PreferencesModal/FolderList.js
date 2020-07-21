import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import dataApi from 'browser/main/lib/dataApi'
import styles from './FolderList.styl'
import { store } from 'browser/main/store'
import FolderItem from './FolderItem'
import { SortableContainer } from 'react-sortable-hoc'
import i18n from 'browser/lib/i18n'

const FolderList = ({ storage, hostBoundingBox }) => {
  const folderList = storage.folders.map((folder, index) => {
    return (
      <FolderItem
        key={folder.key}
        folder={folder}
        storage={storage}
        index={index}
        hostBoundingBox={hostBoundingBox}
      />
    )
  })

  return (
    <div>
      {folderList.length > 0 ? (
        folderList
      ) : (
        <div styleName='folderList-empty'>{i18n.__('No Folders')}</div>
      )}
    </div>
  )
}

FolderList.propTypes = {
  hostBoundingBox: PropTypes.shape({
    bottom: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number
  }),
  storage: PropTypes.shape({
    key: PropTypes.string
  }),
  folder: PropTypes.shape({
    key: PropTypes.number,
    color: PropTypes.string,
    name: PropTypes.string
  })
}

const SortableFolderListComponent = (props, { storage, styles }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    dataApi.reorderFolder(storage.key, oldIndex, newIndex).then(data => {
      store.dispatch({ type: 'REORDER_FOLDER', storage: data.storage })
    })
  }

  const StyledFolderList = CSSModules(FolderList, styles)
  const SortableFolderList = SortableContainer(StyledFolderList)

  return (
    <SortableFolderList
      helperClass='sortableItemHelper'
      onSortEnd={onSortEnd}
      useDragHandle
      {...props}
    />
  )
}

export default CSSModules(SortableFolderListComponent, styles)
