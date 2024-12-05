[**skin**](../../../README.md)

***

[skin](../../../modules.md) / [common/dom](../README.md) / h

# Function: h()

## Call Signature

> **h**\<`TTag`\>(`tag`): `TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

A helper function to create nested dom nodes.

```ts
const elements = h('div.code-view', [
	h('div.title@title'),
	h('div.container', [
		h('div.gutter@gutterDiv'),
		h('div@editor'),
	]),
]);
const editor = createEditor(elements.editor);
```

### Type Parameters

• **TTag** *extends* `string`

### Parameters

#### tag

`TTag`

### Returns

`TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

### Defined in

[common/dom.ts:72](https://github.com/sei-12/skin/blob/71b214be76b363d9a6ca32cbed9404c037be92a0/src/common/dom.ts#L72)

## Call Signature

> **h**\<`TTag`, `T`\>(`tag`, `children`): `ArrayToObj`\<`T`\> & `TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

A helper function to create nested dom nodes.

```ts
const elements = h('div.code-view', [
	h('div.title@title'),
	h('div.container', [
		h('div.gutter@gutterDiv'),
		h('div@editor'),
	]),
]);
const editor = createEditor(elements.editor);
```

### Type Parameters

• **TTag** *extends* `string`

• **T** *extends* `Child`[]

### Parameters

#### tag

`TTag`

#### children

[`...T[]`]

### Returns

`ArrayToObj`\<`T`\> & `TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

### Defined in

[common/dom.ts:76](https://github.com/sei-12/skin/blob/71b214be76b363d9a6ca32cbed9404c037be92a0/src/common/dom.ts#L76)

## Call Signature

> **h**\<`TTag`\>(`tag`, `attributes`): `TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

A helper function to create nested dom nodes.

```ts
const elements = h('div.code-view', [
	h('div.title@title'),
	h('div.container', [
		h('div.gutter@gutterDiv'),
		h('div@editor'),
	]),
]);
const editor = createEditor(elements.editor);
```

### Type Parameters

• **TTag** *extends* `string`

### Parameters

#### tag

`TTag`

#### attributes

`Partial`\<`ElementAttributes`\<`TagToElement`\<`TTag`\>\>\>

### Returns

`TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

### Defined in

[common/dom.ts:80](https://github.com/sei-12/skin/blob/71b214be76b363d9a6ca32cbed9404c037be92a0/src/common/dom.ts#L80)

## Call Signature

> **h**\<`TTag`, `T`\>(`tag`, `attributes`, `children`): `ArrayToObj`\<`T`\> & `TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

A helper function to create nested dom nodes.

```ts
const elements = h('div.code-view', [
	h('div.title@title'),
	h('div.container', [
		h('div.gutter@gutterDiv'),
		h('div@editor'),
	]),
]);
const editor = createEditor(elements.editor);
```

### Type Parameters

• **TTag** *extends* `string`

• **T** *extends* `Child`[]

### Parameters

#### tag

`TTag`

#### attributes

`Partial`\<`ElementAttributes`\<`TagToElement`\<`TTag`\>\>\>

#### children

[`...T[]`]

### Returns

`ArrayToObj`\<`T`\> & `TagToRecord`\<`TTag`\> *extends* infer Y ? `{ [TKey in keyof Y]: Y[TKey] }` : `never`

### Defined in

[common/dom.ts:84](https://github.com/sei-12/skin/blob/71b214be76b363d9a6ca32cbed9404c037be92a0/src/common/dom.ts#L84)
