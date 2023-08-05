import { createPluginFactory } from '@udecode/plate-common';

import { mentionOnKeyDownHandler } from './handlers/mentionOnKeyDownHandler';
import { isSelectionInMentionInput } from './queries/index';
import { MentionPlugin } from './types';
import { withMention } from './withMention';

export const ELEMENT_MENTION = 'mention';
export const ELEMENT_MENTION_INPUT = 'mention_input';

/**
 * Enables support for autocompleting @mentions.
 */
export const createMentionPlugin = createPluginFactory<MentionPlugin>({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isVoid: true,
  handlers: {
    onKeyDown: mentionOnKeyDownHandler({ query: isSelectionInMentionInput }),
  },
  withOverrides: withMention,
  options: {
    trigger: '@',
    triggerPreviousCharPattern: /.*/,
    createMentionNode: (item) => ({ value: `{{${item.type}:${item.value}}}`, mentionType: item.type, mentionModifier: item.value }),
  },
  deserializeHtml: {

    getNode: (el, node) => {
      console.log(node)
      if(el.nodeName === 'MENTION') {
        return {
          type: 'mention',
          value: `{{${el.dataset.type}:${el.dataset.modifier}}}`,
          mentionType: el.dataset.type,
          mentionModifier: el.dataset.modifier
        }
      }
    }
  },
  plugins: [
    {
      key: ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
    },
  ],
  then: (editor, { key }) => ({
    options: {
      id: key,
    },
  }),
});