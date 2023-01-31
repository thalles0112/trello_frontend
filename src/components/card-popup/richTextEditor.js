import React, { useCallback, useEffect, useMemo, } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'

import { MdFormatBold, 
         MdFormatItalic, 
         MdFormatUnderlined, 
         MdCode, 
         MdLooksOne,
         MdLooksTwo,
         MdFormatQuote,
         MdFormatListNumbered,
         MdFormatListBulleted,
         MdFormatAlignLeft,
         MdFormatAlignCenter,
         MdFormatAlignRight,
         MdFormatAlignJustify,
        } from "react-icons/md"
import { editCardDescription, getCard } from '../services/requests'





const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


const RichTextExample = ({card}) => {

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const size = 26
  let initialValue

  
  if (card.description == null || card.description == undefined){

    initialValue = [
        {
          type: 'paragraph',
          children: [
            { text: '' },
           
          ],
        },
       
      ]
  }

  else{
    initialValue = JSON.parse(card.description)
  }

  useEffect(()=>{
    async function setDescription(){
        
        if (card.description){
          editor.children = JSON.parse(card.description)
          editor.onChange()
        }
        
        
    }
    setDescription()
  },[card])
  
  

    const blurHandler=async()=>{
        const content = localStorage.getItem('content')
        if (content === '' || content === undefined || content === null){
          return
        }
        else{
          await editCardDescription(card.id, content, card.title)
        }
        
        
        localStorage.removeItem('content')
        
    }


  return (
    <Slate editor={editor} value={initialValue} onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}>
      <div className={'tool-bar'}>
        <MarkButton format="bold" icon={<MdFormatBold size={size}/>} />
        <MarkButton format="italic" icon={<MdFormatItalic size={size}/>} />
        <MarkButton format="underline" icon={<MdFormatUnderlined size={size}/>} />
        <MarkButton format="code" icon={<MdCode size={size}/>} />
        <BlockButton format="heading-one" icon={<MdLooksOne size={size}/>} />
        <BlockButton format="heading-two" icon={<MdLooksTwo size={size}/>} />
        <BlockButton format="block-quote" icon={<MdFormatQuote size={size}/>}/>
        <BlockButton format="numbered-list" icon={<MdFormatListNumbered size={size}/>} />
        <BlockButton format="bulleted-list" icon={<MdFormatListBulleted size={size}/>} />
        <BlockButton format="left" icon={<MdFormatAlignLeft size={size}/>} />
        <BlockButton format="center" icon={<MdFormatAlignCenter size={size}/>} />
        <BlockButton format="right" icon={<MdFormatAlignRight size={size}/>} />
        <BlockButton format="justify" icon={<MdFormatAlignJustify size={size}/>} />
      </div>
      <Editable
        
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Descrição do card..."
        spellCheck
        //autoFocus
        onBlur={blurHandler}
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event )) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
            
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

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

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <button
      className={`toolbar-button ${isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )?'active':''}`}
    /*  active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}*/
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <div>{icon}</div>
    </button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <button
      
      //active={isMarkActive(editor, format)?true:false}
      className={`toolbar-button ${isMarkActive(editor, format)?'active':''}`}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <div>{icon}</div>
    </button>
  )
}




export default RichTextExample