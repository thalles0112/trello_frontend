import React, { useMemo, useCallback, useRef, useEffect, useState} from 'react'
import ReactDOM from 'react-dom'

import { Editor, Transforms, Range, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused,
} from 'slate-react'
import { editCardViewers } from '../services/requests'

const Portal = ({ children }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}


const MentionExample = ({card, profiles}) => {
  const ref = useRef()
  const [target, setTarget] = useState()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  )

  useEffect(()=>{
    let viewers
    if (card.viewers_details){
      viewers = card.viewers_details.map(viewer=> {return { 
        type: 'mention',
        character: {name:viewer.name, id: viewer.id},
        children: [
          {text: ''}
        ]
      }})


      editor.children =  [
   
        {
          type: 'paragraph',
          children: [
            {
              text: '',
            },
            ...viewers
          ]
          },
      ]
  
      editor.onChange()
    }
    
    
  }, [card, editor])
  

  const initialValue = [
   
    {
      type: 'paragraph',
      children: [
        {
          text: '',
        },
       
      ]
      },

  ]
  


  let chars
 
  if (profiles){
    chars = profiles.filter(c =>
      c.name.toLowerCase().startsWith(search.toLowerCase())
    ).slice(0, 10)
  }
  else {
    chars = []
  }
  

  const blurHandler=useCallback(async()=>{
    let content = JSON.parse(localStorage.getItem('viewers'))
    console.log(content)
    content = (content[0].children.filter(item=>item.type==='mention'))
    content = content.map(item=>item.character.id)
    await editCardViewers(card.id, content, card.title)
    
    
  },[card])

  const onKeyDown = useCallback(
    event => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1
            setIndex(prevIndex)
            break
          case 'ArrowUp':
            event.preventDefault()
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1
            setIndex(nextIndex)
            break
          case 'Tab':
          case 'Enter':
            event.preventDefault()
            Transforms.select(editor, target)
            insertMention(editor, chars[index])
            
            setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setTarget(null)
            break
          default:
            break
        }
      }
    },
    [index, target, chars, editor]
  )

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current
      const domRange = ReactEditor.toDOMRange(editor, target)
      const rect = domRange.getBoundingClientRect()
      el.style.top = `${rect.top + window.pageYOffset + 24}px`
      el.style.left = `${rect.left + window.pageXOffset}px`
    }
  }, [chars.length, editor, index, search, target])

  return (
    <Slate
      editor={editor}
      value={initialValue}
      
      onChange={(value) => {
        const { selection } = editor
        const content = JSON.stringify(value)
        localStorage.setItem('viewers', content)
        

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection)
          const wordBefore = Editor.before(editor, start, { unit: 'word' })
          const before = wordBefore && Editor.before(editor, wordBefore)
          const beforeRange = before && Editor.range(editor, before, start)
          const beforeText = beforeRange && Editor.string(editor, beforeRange)
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
          const after = Editor.after(editor, start)
          const afterRange = Editor.range(editor, start, after)
          const afterText = Editor.string(editor, afterRange)
          const afterMatch = afterText.match(/^(\s|$)/)

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange)
            setSearch(beforeMatch[1])
            setIndex(0)
            return
          }
        }

        setTarget(null)
      }}
    >
      <Editable
        onBlur={()=>setTimeout(()=>blurHandler(), 200)}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        onTouchStart={(event)=>{event.preventDefault()}}
        onDoubleClick={(event)=>{event.preventDefault()}}
        placeholder="Mencione uma pessoa..."
      />
      {target && chars.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 19,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
            data-cy="mentions-portal"
          >
            {chars.map((char, i) => (
              <div
                onClick={(event)=>{
                  event.preventDefault()
                  Transforms.select(editor, target)
                  insertMention(editor, chars[i])
                  setTarget(null)
                }}
                key={char.id}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {char.name}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  )
}

const withMentions = editor => {
  const { isInline, isVoid, markableVoid } = editor

  editor.isInline = element => {
    return element.type === 'mention' ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  editor.markableVoid = element => {
    return element.type === 'mention' || markableVoid(element)
  }

  return editor
}

const insertMention = (editor, character) => {
  const mention = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  const style = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  }
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = 'bold'
  }
  if (element.children[0].italic) {
    style.fontStyle = 'italic'
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.name.replace(' ', '-')}`}
      style={style}
    >
      {children}@{element.character.name}
    </span>
  )
}




export default MentionExample