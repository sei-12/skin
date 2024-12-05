[**skin**](../../../../../../README.md)

***

[skin](../../../../../../modules.md) / [Elements/TagSuggestionWindow/TagSuggestionWindow](../../../README.md) / [TagSuggestionWindow](../README.md) / Element

# Class: Element

## Constructors

### new Element()

> **new Element**(`tagFinder`, `commandEmmiter`, `settings`?): [`Element`](Element.md)

#### Parameters

##### tagFinder

[`TagFinder`](../interfaces/TagFinder.md)

##### commandEmmiter

[`I_CommandEmmiter`](../../../../../../lib/CommandEmmiter/interfaces/I_CommandEmmiter.md)

##### settings?

[`Setting`](../interfaces/Setting.md)

#### Returns

[`Element`](Element.md)

#### Defined in

[src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts:239](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts#L239)

## Properties

### root

> **root**: `HTMLElement`

#### Defined in

[src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts:269](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts#L269)

## Methods

### getFocused()

> **getFocused**(): `null` \| `string`

#### Returns

`null` \| `string`

#### Defined in

[src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts:292](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts#L292)

***

### setWindowPos()

> **setWindowPos**(`topPx`, `leftPx`): `void`

#### Parameters

##### topPx

`number`

##### leftPx

`number`

#### Returns

`void`

#### Defined in

[src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts:287](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts#L287)

***

### update()

> **update**(`predicate`): `Promise`\<`void`\>

#### Parameters

##### predicate

`string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts:272](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/Elements/TagSuggestionWindow/TagSuggestionWindow.ts#L272)
