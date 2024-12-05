[**skin**](../../../README.md)

***

[skin](../../../modules.md) / [lib/EmiterCore](../README.md) / CommandEmiterCore

# Class: CommandEmiterCore

## Implements

- [`I_CommandEmmiter`](../../CommandEmmiter/interfaces/I_CommandEmmiter.md)

## Constructors

### new CommandEmiterCore()

> **new CommandEmiterCore**(): [`CommandEmiterCore`](CommandEmiterCore.md)

#### Returns

[`CommandEmiterCore`](CommandEmiterCore.md)

## Methods

### addWeakRefListener()

> **addWeakRefListener**(`listener`): `void`

#### Parameters

##### listener

[`CommandEmiterListener`](CommandEmiterListener.md)

#### Returns

`void`

#### Implementation of

[`I_CommandEmmiter`](../../CommandEmmiter/interfaces/I_CommandEmmiter.md).[`addWeakRefListener`](../../CommandEmmiter/interfaces/I_CommandEmmiter.md#addweakreflistener)

#### Defined in

[src/lib/EmiterCore.ts:38](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/lib/EmiterCore.ts#L38)

***

### emit()

> **emit**(`type`): `void`

#### Parameters

##### type

`"tagSuggestionWindow.focusDown"` | `"tagSuggestionWindow.focusUp"` | `"tagSuggestionWindow.Done"` | `"focusBkmkPredicateInputbox"` | `"bkmkList.focusDown"` | `"bkmkList.focusUp"`

#### Returns

`void`

#### Defined in

[src/lib/EmiterCore.ts:6](https://github.com/sei-12/skin/blob/81c96f7bf20bc69580a253172a69c2bb254ec862/src/lib/EmiterCore.ts#L6)
