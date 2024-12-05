[**skin**](../../../README.md)

***

[skin](../../../modules.md) / [lib/EmiterCore](../README.md) / CommandEmiterListener

# Class: CommandEmiterListener

リスナーの寿命がハンドラの寿命
リスナーの参照を保持しないとリスナーがGCされてハンドラもGCされることに注意

## Constructors

### new CommandEmiterListener()

> **new CommandEmiterListener**(...`handlers`): [`CommandEmiterListener`](CommandEmiterListener.md)

#### Parameters

##### handlers

...[`"tagSuggestionWindow.focusDown"` \| `"tagSuggestionWindow.focusUp"` \| `"tagSuggestionWindow.Done"` \| `"focusBkmkPredicateInputbox"` \| `"bkmkList.focusDown"` \| `"bkmkList.focusUp"`, () => `void`][]

#### Returns

[`CommandEmiterListener`](CommandEmiterListener.md)

#### Defined in

[src/lib/EmiterCore.ts:54](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/lib/EmiterCore.ts#L54)

## Properties

### handlers

> `readonly` **handlers**: [`"tagSuggestionWindow.focusDown"` \| `"tagSuggestionWindow.focusUp"` \| `"tagSuggestionWindow.Done"` \| `"focusBkmkPredicateInputbox"` \| `"bkmkList.focusDown"` \| `"bkmkList.focusUp"`, () => `void`][]

#### Defined in

[src/lib/EmiterCore.ts:52](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/lib/EmiterCore.ts#L52)

***

### instanceId

> `readonly` **instanceId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Defined in

[src/lib/EmiterCore.ts:51](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/lib/EmiterCore.ts#L51)
