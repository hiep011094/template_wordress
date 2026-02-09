(function (wp) {
    const { addFilter } = wp.hooks;
    const { registerBlockType, registerBlockVariation  } = wp.blocks;
    const { InspectorControls, RichText } = wp.blockEditor;
    const { PanelBody, RangeControl, SelectControl, ColorPalette, Button  } = wp.components;
    const { createElement: el, Fragment, cloneElement  } = wp.element;

    addFilter(
        'blocks.registerBlockType',
        'mytheme/image-caption-style-attr',
        function (settings, name) {

            if (name !== 'core/image') {
                return settings;
            }

            settings.attributes = Object.assign({}, settings.attributes, {
                captionStyle: {
                    type: 'string',
                    default: 'default',
                },
            });

            return settings;
        }
    );

    addFilter(
        'editor.BlockEdit',
        'mytheme/image-caption-style-control',
        function (BlockEdit) {

            return function (props) {

                if (props.name !== 'core/image') {
                    return el(BlockEdit, props);
                }

                const { attributes, setAttributes } = props;

                return el(
                    Fragment,
                    {},

                    el(BlockEdit, props),

                    el(
                        InspectorControls,
                        {},
                        el(
                            PanelBody,
                            {
                                title: 'キャプションスタイル',
                                initialOpen: true,
                            },
                            el(SelectControl, {
                                label: 'スタイル',
                                value: attributes.captionStyle,
                                options: [
                                    { label: 'デフォルト', value: 'default' },
                                    { label: 'スモール', value: 'small' },
                                    { label: 'ビッグ', value: 'big' },
                                ],
                                onChange: function (val) {
                                    setAttributes({ captionStyle: val });
                                },
                            })
                        )
                    )
                );
            };
        }
    );

    addFilter(
        'editor.BlockListBlock',
        'mytheme/image-caption-style-editor-preview',
        function (BlockListBlock) {

            return function (props) {

                if (props.name !== 'core/image') {
                    return el(BlockListBlock, props);
                }

                const style = props.attributes.captionStyle;

                if (!style || style === 'default') {
                    return el(BlockListBlock, props);
                }

                const newProps = Object.assign({}, props, {
                    className: [
                        props.className,
                        'caption-' + style
                    ].filter(Boolean).join(' ')
                });

                return el(BlockListBlock, newProps);
            };
        }
    );

    addFilter(
        'blocks.getSaveElement',
        'mytheme/image-caption-style-save',
        function (element, blockType, attributes) {

            if (blockType.name !== 'core/image') {
                return element;
            }

            if (
                !attributes.captionStyle ||
                attributes.captionStyle === 'default'
            ) {
                return element;
            }

            return cloneElement(element, {
                className: [
                    element.props.className,
                    'caption-' + attributes.captionStyle,
                ]
                    .filter(Boolean)
                    .join(' ')
            });
        }
    );

    const FONT_FAMILIES = [
        { label: 'デフォルト', value: '' },
        { label: 'Zen Kaku Gothic Antique', value: '"Zen Kaku Gothic Antique", sans-serif' },
        { label: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
        { label: 'IBM Plex Sans JP', value: '"IBM Plex Sans JP", sans-serif' },
    ];

    const FONT_WEIGHTS = [
        { label: 'デフォルト', value: '' },
        ...[100,200,300,400,500,600,700,800,900].map(v => ({
            label: String(v),
            value: String(v)
        }))
    ];

    const renderTextStylePanel = ({
        panelTitle,
        style,
        setAttributes,
        attrKey,
        fontSizeRange = { min: 12, max: 200 },
        showLineHeight = false,
        showMarginBottom = false
    }) => {
        const updateStyle = (newStyle) =>
        setAttributes({
            [attrKey]: { ...style, ...newStyle }
        });

        return el(
            PanelBody,
            { title: panelTitle, initialOpen: false },

            el(ColorPalette, {
                label: 'テキストカラー',
                value: style.color,
                onChange: (v) => updateStyle({ color: v })
            }),

            el(SelectControl, {
                label: 'フォントファミリー',
                value: style.fontFamily || '',
                options: FONT_FAMILIES,
                onChange: (v) => updateStyle({ fontFamily: v })
            }),

            el(SelectControl, {
                label: 'フォントウェイト',
                value: style.fontWeight || '',
                options: FONT_WEIGHTS,
                onChange: (v) => updateStyle({ fontWeight: v })
            }),

            el(RangeControl, {
                label: 'フォントサイズ（px）',
                min: fontSizeRange.min,
                max: fontSizeRange.max,
                value: style.fontSize ? parseInt(style.fontSize) : undefined,
                onChange: (v) => updateStyle({ fontSize: v + 'px' })
            }),

            showMarginBottom &&
                el(RangeControl, {
                    label: '下マージン（px）',
                    min: 0,
                    max: 120,
                    value: style.marginBottom ? parseInt(style.marginBottom) : 0,
                    onChange: (v) => updateStyle({ marginBottom: v + 'px' })
                }),

            showLineHeight &&
                el(RangeControl, {
                    label: '行間',
                    min: 1,
                    max: 3,
                    step: 0.1,
                    value: style.lineHeight || 1.6,
                    onChange: (v) => updateStyle({ lineHeight: v })
                })
        );
    };

    registerBlockType('my/wp-block01', {
        title: 'ブロック01',
        category: 'my-category-custom',
        supports: {
            html: false
        },

        attributes: {
            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block01__ttl',
            },
            titleStyle: {
                type: 'object',
                default: {}
            },

            content: {
                type: 'string',
                source: 'html',
                selector: '.wp-block01__content',
            },
            contentStyle: {
                type: 'object',
                default: {}
            },

            maxWidth: {
                type: 'number',
                default: 1140
            }
        },

        example: {
            attributes: {
                title: 'メインタイトル',
                content: 'コンテンツ',
            },
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                content,
                titleStyle,
                contentStyle,
                maxWidth
            } = attributes;

            return [
                /* -------- Sidebar -------- */
                el(
                    InspectorControls,
                    {},

                    /* Layout */
                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    /* メインタイトルスタイル */
                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 10, max: 200 },
                        showMarginBottom: true
                    }),

                    /* コンテンツスタイル */
                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 10, max: 200 },
                        showLineHeight: true
                    })
                ),

                /* -------- Block -------- */
                el(
                    'div',
                    {
                        className: 'wp-block01',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block01__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v }),
                    }),

                    el(RichText, {
                        tagName: 'div',
                        className: 'wp-block01__content',
                        value: content,
                        placeholder: 'コンテンツ',
                        style: contentStyle,
                        onChange: (v) => setAttributes({ content: v }),
                    })
                )
            ];
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                content,
                titleStyle,
                contentStyle,
                maxWidth
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block01',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block01__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(RichText.Content, {
                    tagName: 'div',
                    className: 'wp-block01__content',
                    value: content,
                    style: contentStyle
                })
            );
        },
    });

    registerBlockType('my/wp-block02', {
        title: 'ブロック02',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },
            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block02__ttl',
            },
            titleStyle: {
                type: 'object',
                default: {}
            },

            firstStyle: {
                type: 'object',
                default: {}
            },

            contentStyle: {
                type: 'object',
                default: {}
            },

            items: {
                type: 'array',
                default: [
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        example: {
            attributes: {
                title: 'メインタイトル',
                items: [
                    { first: 'サブタイトル', content: 'コンテンツ' },
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                titleStyle,
                firstStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            const updateItem = (index, key, value) => {
                const newItems = [...items];
                newItems[index] = { ...newItems[index], [key]: value };
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, { first: 'サブタイトル', content: 'コンテンツ' }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment,
                {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 14, max: 80 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'サブタイトルスタイル',
                        style: firstStyle,
                        setAttributes,
                        attrKey: 'firstStyle',
                        fontSizeRange: { min: 10, max: 40 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 12, max: 40 },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div',
                    {
                        className: 'wp-block02',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block02__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v }),
                    }),

                    el(
                        'div',
                        { className: 'wp-block02__inner' },

                        items.map((item, index) =>
                            el(
                                'div',
                                { className: 'wp-block02__item', key: index },

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block02__first',
                                    value: item.first,
                                    style: firstStyle,
                                    onChange: (v) => updateItem(index, 'first', v),
                                }),

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block02__content',
                                    value: item.content,
                                    style: contentStyle,
                                    onChange: (v) => updateItem(index, 'content', v),
                                }),

                                el(
                                    Button,
                                    {
                                        isSmall: true,
                                        isDestructive: true,
                                        onClick: () => removeItem(index),
                                        style: { marginTop: '6px' }
                                    },
                                    '削除'
                                )
                            )
                        ),

                        el(
                            Button,
                            {
                                isPrimary: true,
                                onClick: addItem,
                                style: { marginTop: '10px' }
                            },
                            '＋ アイテム追加'
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                titleStyle,
                firstStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block02',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block02__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(
                    'div',
                    { className: 'wp-block02__inner' },

                    items.map((item, index) =>
                        el(
                            'div',
                            { className: 'wp-block02__item', key: index },

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block02__first',
                                value: item.first,
                                style: firstStyle
                            }),

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block02__content',
                                value: item.content,
                                style: contentStyle
                            })
                        )
                    )
                )
            );
        },
    });

    registerBlockType('my/wp-block03', {
        title: 'ブロック03',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },
            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block03__ttl',
            },
            titleStyle: {
                type: 'object',
                default: {}
            },

            /* ❌ KHÔNG dùng style cho __first nữa */
            /* ✅ THÊM 2 style con */
            firstTxtStyle: {
                type: 'object',
                default: {}
            },
            firstNumStyle: {
                type: 'object',
                default: {}
            },

            contentStyle: {
                type: 'object',
                default: {}
            },

            /* 🔒 GIỮ NGUYÊN STRUCTURE */
            items: {
                type: 'array',
                default: [
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        example: {
            attributes: {
                title: 'メインタイトル',
                items: [
                    { first: 'サブタイトル', content: 'コンテンツ' },
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                titleStyle,
                firstTxtStyle,
                firstNumStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            const updateItem = (index, key, value) => {
                const newItems = [...items];
                newItems[index] = { ...newItems[index], [key]: value };
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, { first: '強み', content: 'コンテンツ' }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment,
                {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 14, max: 80 }
                    }),

                    /* ✅ NEW – First text */
                    renderTextStylePanel({
                        panelTitle: '強みテキストスタイル',
                        style: firstTxtStyle,
                        setAttributes,
                        attrKey: 'firstTxtStyle',
                        fontSizeRange: { min: 10, max: 40 }
                    }),

                    /* ✅ NEW – First number */
                    renderTextStylePanel({
                        panelTitle: '番号スタイル',
                        style: firstNumStyle,
                        setAttributes,
                        attrKey: 'firstNumStyle',
                        fontSizeRange: { min: 10, max: 40 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 12, max: 40 },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div',
                    {
                        className: 'wp-block03',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block03__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v }),
                    }),

                    el(
                        'div',
                        { className: 'wp-block03__inner' },

                        items.map((item, index) =>
                            el(
                                'div',
                                { className: 'wp-block03__item', key: index },

                                /* ✅ ONLY CHANGE HERE */
                                el(
                                    'div',
                                    { className: 'wp-block03__first' },

                                    el(RichText, {
                                        tagName: 'span',
                                        className: 'wp-block03__first__txt',
                                        value: item.first,
                                        style: firstTxtStyle,
                                        onChange: (v) => updateItem(index, 'first', v),
                                    }),

                                    el(
                                        'span',
                                        {
                                            className: 'wp-block03__first__num',
                                            style: firstNumStyle
                                        },
                                        String(index + 1).padStart(2, '0')
                                    )
                                ),

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block03__content',
                                    value: item.content,
                                    style: contentStyle,
                                    onChange: (v) => updateItem(index, 'content', v),
                                }),

                                el(
                                    Button,
                                    {
                                        isSmall: true,
                                        isDestructive: true,
                                        onClick: () => removeItem(index),
                                        style: { marginTop: '6px' }
                                    },
                                    '削除'
                                )
                            )
                        ),

                        el(
                            Button,
                            {
                                isPrimary: true,
                                onClick: addItem,
                                style: { marginTop: '10px' }
                            },
                            '＋ アイテム追加'
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                titleStyle,
                firstTxtStyle,
                firstNumStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block03',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block03__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(
                    'div',
                    { className: 'wp-block03__inner' },

                    items.map((item, index) =>
                        el(
                            'div',
                            { className: 'wp-block03__item', key: index },

                            el(
                                'div',
                                { className: 'wp-block03__first' },

                                el(RichText.Content, {
                                    tagName: 'span',
                                    className: 'wp-block03__first__txt',
                                    value: item.first,
                                    style: firstTxtStyle
                                }),

                                el(
                                    'span',
                                    {
                                        className: 'wp-block03__first__num',
                                        style: firstNumStyle
                                    },
                                    String(index + 1).padStart(2, '0')
                                )
                            ),

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block03__content',
                                value: item.content,
                                style: contentStyle
                            })
                        )
                    )
                )
            );
        },
    });

    registerBlockType('my/wp-block04', {
        title: 'ブロック04',
        category: 'my-category-custom',
        supports: {
            html: false
        },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },

            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block04__ttl',
            },

            titleStyle: {
                type: 'object',
                default: {}
            },

            /* giữ để không phá dữ liệu cũ */
            firstStyle: {
                type: 'object',
                default: {}
            },

            contentStyle: {
                type: 'object',
                default: {}
            },

            items: {
                type: 'array',
                default: [{
                    first: 'サブタイトル',
                    content: 'コンテンツ'
                }]
            }
        },

        example: {
            attributes: {
                title: 'メインタイトル',
                items: [{
                        first: 'サブタイトル',
                        content: 'コンテンツ'
                    },
                    {
                        first: 'サブタイトル',
                        content: 'コンテンツ'
                    }
                ]
            }
        },

        /* ================= EDIT ================= */
        edit({
            attributes,
            setAttributes
        }) {
            const {
                title,
                titleStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            const updateItem = (index, value) => {
                const newItems = [...items];
                newItems[index] = {
                    ...newItems[index],
                    content: value
                };
                setAttributes({
                    items: newItems
                });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, {
                        first: 'サブタイトル',
                        content: 'コンテンツ'
                    }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment, {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls, {},

                    el(
                        PanelBody, {
                            title: 'Layout',
                            initialOpen: true
                        },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({
                                maxWidth: v
                            })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: {
                            min: 14,
                            max: 80
                        }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: {
                            min: 12,
                            max: 40
                        },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div', {
                        className: 'wp-block04',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block04__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({
                            title: v
                        })
                    }),

                    el(
                        'div', {
                            className: 'wp-block04__inner'
                        },

                        items.map((item, index) =>
                            el(
                                'div',
                                {
                                    className: 'wp-block04__item',
                                    key: index
                                },

                                el(RichText, {
                                    tagName: 'div',
                                    value: item.content,
                                    style: contentStyle,
                                    onChange: (v) => updateItem(index, v),
                                }),

                                el(
                                    Button,
                                    {
                                        isSmall: true,
                                        isDestructive: true,
                                        onClick: () => removeItem(index),
                                        style: { marginTop: '6px' }
                                    },
                                    '削除'
                                )
                            )
                        ),

                        el(
                            Button, {
                                isPrimary: true,
                                onClick: addItem,
                                style: {
                                    marginTop: '10px'
                                }
                            },
                            '＋ アイテム追加'
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({
            attributes
        }) {
            const {
                title,
                titleStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            return el(
                'div', {
                    className: 'wp-block04',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block04__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(
                    'div', {
                        className: 'wp-block04__inner'
                    },

                    items.map((item, index) =>
                        el(RichText.Content, {
                            tagName: 'div',
                            className: 'wp-block04__item',
                            value: item.content,
                            style: contentStyle,
                            key: index
                        })
                    )
                )
            );
        }
    });

    registerBlockType('my/wp-block05', {
        title: 'ブロック05',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },

            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block05__ttl',
            },

            titleStyle: {
                type: 'object',
                default: {}
            },

            content: {
                type: 'string',
                source: 'html',
                selector: '.wp-block05__content',
            },

            contentStyle: {
                type: 'object',
                default: {}
            }
        },

        example: {
            attributes: {
                title: 'タイトル',
                content: 'コンテンツ'
            }
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                content,
                titleStyle,
                contentStyle,
                maxWidth
            } = attributes;

            return el(
                Fragment,
                {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 14, max: 80 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 12, max: 40 },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div',
                    {
                        className: 'wp-block05',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block05__ttl',
                        value: title,
                        placeholder: 'タイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v })
                    }),

                    el(RichText, {
                        tagName: 'div',
                        className: 'wp-block05__content',
                        value: content,
                        placeholder: 'コンテンツ',
                        style: contentStyle,
                        onChange: (v) => setAttributes({ content: v })
                    })
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                content,
                titleStyle,
                contentStyle,
                maxWidth
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block05',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block05__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(RichText.Content, {
                    tagName: 'div',
                    className: 'wp-block05__content',
                    value: content,
                    style: contentStyle
                })
            );
        }
    });

    registerBlockType('my/wp-block06', {
        title: 'ブロック06',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },
            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block06__ttl',
            },
            titleStyle: {
                type: 'object',
                default: {}
            },

            firstStyle: {
                type: 'object',
                default: {}
            },

            contentStyle: {
                type: 'object',
                default: {}
            },

            items: {
                type: 'array',
                default: [
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        example: {
            attributes: {
                title: 'メインタイトル',
                items: [
                    { first: 'サブタイトル', content: 'コンテンツ' },
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                titleStyle,
                firstStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            const updateItem = (index, key, value) => {
                const newItems = [...items];
                newItems[index] = { ...newItems[index], [key]: value };
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, { first: 'サブタイトル', content: 'コンテンツ' }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment,
                {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 14, max: 80 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'サブタイトルスタイル',
                        style: firstStyle,
                        setAttributes,
                        attrKey: 'firstStyle',
                        fontSizeRange: { min: 10, max: 40 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 12, max: 40 },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div',
                    {
                        className: 'wp-block06',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block06__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v }),
                    }),

                    el(
                        'div',
                        { className: 'wp-block06__inner' },

                        items.map((item, index) =>
                            el(
                                'div',
                                { className: 'wp-block06__item', key: index },

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block06__first',
                                    value: item.first,
                                    style: firstStyle,
                                    onChange: (v) => updateItem(index, 'first', v),
                                }),

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block06__content',
                                    value: item.content,
                                    style: contentStyle,
                                    onChange: (v) => updateItem(index, 'content', v),
                                }),

                                el(
                                    Button,
                                    {
                                        isSmall: true,
                                        isDestructive: true,
                                        onClick: () => removeItem(index),
                                        style: { marginTop: '6px' }
                                    },
                                    '削除'
                                )
                            )
                        ),

                        el(
                            Button,
                            {
                                isPrimary: true,
                                onClick: addItem,
                                style: { marginTop: '10px' }
                            },
                            '＋ アイテム追加'
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                titleStyle,
                firstStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block06',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block06__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(
                    'div',
                    { className: 'wp-block06__inner' },

                    items.map((item, index) =>
                        el(
                            'div',
                            { className: 'wp-block06__item', key: index },

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block06__first',
                                value: item.first,
                                style: firstStyle
                            }),

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block06__content',
                                value: item.content,
                                style: contentStyle
                            })
                        )
                    )
                )
            );
        },
    });

    registerBlockType('my/wp-block07', {
        title: 'ブロック07',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: { type: 'number', default: 1140 },

            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block07__ttl',
            },
            titleStyle: { type: 'object', default: {} },

            numStyle: { type: 'object', default: {} },
            itemTitleStyle: { type: 'object', default: {} },
            itemTextStyle: { type: 'object', default: {} },
            captionStyle: { type: 'object', default: {} },

            items: {
                type: 'array',
                default: [{ title: '', text: '' }]
            },

            images: {
                type: 'array',
                default: [{ id: null, url: '', alt: '', caption: '' }]
            }
        },
        example: {
            attributes: {
                title: 'メインタイトル',

                items: [
                    {
                        title: 'サブタイトル',
                        text: 'コンテンツ'
                    },
                    {
                        title: 'サブタイトル',
                        text: 'コンテンツ'
                    }
                ],

                images: [
                    {
                        id: null,
                        url: 'https://via.placeholder.com/600x400?text=Image+01',
                        alt: '',
                        caption: 'キャプション'
                    },
                    {
                        id: null,
                        url: 'https://via.placeholder.com/600x400?text=Image+02',
                        alt: '',
                        caption: 'キャプション'
                    }
                ]
            }
        },
        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                titleStyle,
                numStyle,
                itemTitleStyle,
                itemTextStyle,
                captionStyle,
                items,
                images,
                maxWidth
            } = attributes;

            /* ===== ITEM ===== */
            const updateItem = (index, key, value) => {
                const next = [...items];
                next[index] = { ...next[index], [key]: value };
                setAttributes({ items: next });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, { title: '', text: '' }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            /* ===== IMAGE ===== */
            const updateImage = (index, data) => {
                const next = [...images];
                next[index] = { ...next[index], ...data };
                setAttributes({ images: next });
            };

            const addImage = () => {
                setAttributes({
                    images: [...images, { id: null, url: '', alt: '', caption: '' }]
                });
            };

            const removeImage = (index) => {
                setAttributes({
                    images: images.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment,
                {},

                /* ================= SIDEBAR ================= */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 14, max: 80 }
                    }),

                    renderTextStylePanel({
                        panelTitle: '番号スタイル',
                        style: numStyle,
                        setAttributes,
                        attrKey: 'numStyle',
                        fontSizeRange: { min: 10, max: 40 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'サブタイトルスタイル',
                        style: itemTitleStyle,
                        setAttributes,
                        attrKey: 'itemTitleStyle',
                        fontSizeRange: { min: 12, max: 40 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: itemTextStyle,
                        setAttributes,
                        attrKey: 'itemTextStyle',
                        fontSizeRange: { min: 12, max: 30 },
                        showLineHeight: true
                    }),

                    renderTextStylePanel({
                        panelTitle: '画像キャプションスタイル',
                        style: captionStyle,
                        setAttributes,
                        attrKey: 'captionStyle',
                        fontSizeRange: { min: 10, max: 20 }
                    })
                ),

                /* ================= BLOCK ================= */
                el(
                    'div',
                    {
                        className: 'wp-block07',
                        style: { maxWidth: maxWidth + 'px', marginLeft: 'auto', marginRight: 'auto', }
                    },

                    /* Title */
                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block07__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v })
                    }),

                    el(
                        'div',
                        { className: 'wp-block07__inner' },

                        /* ===== LEFT ===== */
                        el(
                            'div',
                            { className: 'wp-block07__left' },

                            items.map((item, i) =>
                                el(
                                    'div',
                                    { className: 'wp-block07__item', key: i },

                                    el(
                                        'div',
                                        { className: 'wp-block07__num', style: numStyle },
                                        String(i + 1).padStart(2, '0')
                                    ),

                                    el(
                                        'div',
                                        { className: 'wp-block07__content' },

                                        el(RichText, {
                                            tagName: 'h3',
                                            className: 'wp-block07__ttl01',
                                            value: item.title,
                                            placeholder: 'サブタイトル',
                                            style: itemTitleStyle,
                                            onChange: (v) => updateItem(i, 'title', v)
                                        }),

                                        el(RichText, {
                                            tagName: 'p',
                                            className: 'wp-block07__txt',
                                            value: item.text,
                                            placeholder: 'コンテンツ',
                                            style: itemTextStyle,
                                            onChange: (v) => updateItem(i, 'text', v)
                                        })
                                    ),

                                    el(
                                        Button,
                                        {
                                            isSmall: true,
                                            isDestructive: true,
                                            onClick: () => removeItem(i),
                                            style: { marginTop: '6px' }
                                        },
                                        '削除'
                                    )
                                )
                            ),

                            el(
                                Button,
                                { isPrimary: true, onClick: addItem },
                                '＋ アイテム追加'
                            )
                        ),

                        /* ===== RIGHT ===== */
                        el(
                            'div',
                            { className: 'wp-block07__right' },

                            images.map((img, i) =>
                                el(
                                    'figure',
                                    { className: 'wp-block07__img', key: i },

                                    el(
                                        wp.blockEditor.MediaUpload,
                                        {
                                            onSelect: (media) =>
                                                updateImage(i, {
                                                    id: media.id,
                                                    url: media.url,
                                                    alt: media.alt
                                                }),
                                            allowedTypes: ['image'],
                                            value: img.id,
                                            render: ({ open }) =>
                                                img.url
                                                    ? el('img', {
                                                        src: img.url,
                                                        alt: img.alt,
                                                        onClick: open,
                                                        style: { cursor: 'pointer' }
                                                    })
                                                    : el(
                                                        Button,
                                                        { onClick: open, isSecondary: true },
                                                        '画像を選択'
                                                    )
                                        }
                                    ),

                                    el(RichText, {
                                        tagName: 'figcaption',
                                        value: img.caption,
                                        placeholder: 'キャプション',
                                        style: captionStyle,
                                        onChange: (v) => updateImage(i, { caption: v })
                                    }),

                                    el(
                                        Button,
                                        {
                                            isSmall: true,
                                            isDestructive: true,
                                            onClick: () => removeImage(i),
                                            style: { marginTop: '6px' }
                                        },
                                        '削除'
                                    )
                                )
                            ),

                            el(
                                Button,
                                { isPrimary: true, onClick: addImage },
                                '＋ 画像追加'
                            )
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                titleStyle,
                numStyle,
                itemTitleStyle,
                itemTextStyle,
                captionStyle,
                items,
                images,
                maxWidth
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block07',
                    style: { maxWidth: maxWidth + 'px', marginLeft: 'auto', marginRight: 'auto', }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block07__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(
                    'div',
                    { className: 'wp-block07__inner' },

                    el(
                        'div',
                        { className: 'wp-block07__left' },

                        items.map((item, i) =>
                            el(
                                'div',
                                { className: 'wp-block07__item', key: i },

                                el(
                                    'div',
                                    { className: 'wp-block07__num', style: numStyle },
                                    String(i + 1).padStart(2, '0')
                                ),

                                el(
                                    'div',
                                    { className: 'wp-block07__content' },

                                    el(RichText.Content, {
                                        tagName: 'h3',
                                        className: 'wp-block07__ttl01',
                                        value: item.title,
                                        style: itemTitleStyle
                                    }),

                                    el(RichText.Content, {
                                        tagName: 'p',
                                        className: 'wp-block07__txt',
                                        value: item.text,
                                        style: itemTextStyle
                                    })
                                )
                            )
                        )
                    ),

                    el(
                        'div',
                        { className: 'wp-block07__right' },

                        images.map((img, i) =>
                            el(
                                'figure',
                                { className: 'wp-block07__img', key: i },

                                img.url && el('img', { src: img.url, alt: img.alt }),

                                el(RichText.Content, {
                                    tagName: 'figcaption',
                                    value: img.caption,
                                    style: captionStyle
                                })
                            )
                        )
                    )
                )
            );
        }
    });

    registerBlockType('my/wp-block08', {
        title: 'ブロック08',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },
            title: {
                type: 'string',
                source: 'html',
                selector: '.wp-block08__ttl',
            },
            titleStyle: {
                type: 'object',
                default: {}
            },

            firstStyle: {
                type: 'object',
                default: {}
            },

            contentStyle: {
                type: 'object',
                default: {}
            },

            items: {
                type: 'array',
                default: [
                    { first: 'メインタイトル', content: 'コンテンツ' }
                ]
            }
        },

        example: {
            attributes: {
                title: 'メインタイトル',
                items: [
                    { first: 'サブタイトル', content: 'コンテンツ' },
                    { first: 'サブタイトル', content: 'コンテンツ' }
                ]
            }
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                titleStyle,
                firstStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            const updateItem = (index, key, value) => {
                const newItems = [...items];
                newItems[index] = { ...newItems[index], [key]: value };
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, { first: 'サブタイトル', content: 'コンテンツ' }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment,
                {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'メインタイトルスタイル',
                        style: titleStyle,
                        setAttributes,
                        attrKey: 'titleStyle',
                        fontSizeRange: { min: 14, max: 80 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'サブタイトルスタイル',
                        style: firstStyle,
                        setAttributes,
                        attrKey: 'firstStyle',
                        fontSizeRange: { min: 10, max: 40 }
                    }),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 12, max: 40 },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div',
                    {
                        className: 'wp-block08',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }
                    },

                    el(RichText, {
                        tagName: 'h2',
                        className: 'wp-block08__ttl',
                        value: title,
                        placeholder: 'メインタイトル',
                        style: titleStyle,
                        onChange: (v) => setAttributes({ title: v }),
                    }),

                    el(
                        'div',
                        { className: 'wp-block08__inner' },

                        items.map((item, index) =>
                            el(
                                'div',
                                { className: 'wp-block08__item', key: index },

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block08__first',
                                    value: item.first,
                                    style: firstStyle,
                                    onChange: (v) => updateItem(index, 'first', v),
                                }),

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block08__content',
                                    value: item.content,
                                    style: contentStyle,
                                    onChange: (v) => updateItem(index, 'content', v),
                                }),

                                el(
                                    Button,
                                    {
                                        isSmall: true,
                                        isDestructive: true,
                                        onClick: () => removeItem(index),
                                        style: { marginTop: '6px' }
                                    },
                                    '削除'
                                )
                            )
                        ),

                        el(
                            Button,
                            {
                                isPrimary: true,
                                onClick: addItem,
                                style: { marginTop: '10px' }
                            },
                            '＋ アイテム追加'
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                titleStyle,
                firstStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block08',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                },

                el(RichText.Content, {
                    tagName: 'h2',
                    className: 'wp-block08__ttl',
                    value: title,
                    style: titleStyle
                }),

                el(
                    'div',
                    { className: 'wp-block08__inner' },

                    items.map((item, index) =>
                        el(
                            'div',
                            { className: 'wp-block08__item', key: index },

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block08__first',
                                value: item.first,
                                style: firstStyle
                            }),

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block08__content',
                                value: item.content,
                                style: contentStyle
                            })
                        )
                    )
                )
            );
        },
    });

    registerBlockVariation('core/buttons', {
        name: 'my-buttons-style02',
        title: 'Buttons (Style 02)',
        description: 'Custom buttons layout',
        icon: 'button',
        category: 'my-category-custom',

        attributes: {
            layout: {
                type: 'flex',
                justifyContent: 'left'
            },
            className: 'wp-btn01s'
        },

        innerBlocks: [
            [
                'core/button',
                {
                    text: 'ボタン',
                    className: 'wp-btn01'
                }
            ]
        ],

        scope: ['inserter']
    });

    registerBlockType('my/wp-block09', {
        title: 'ブロック09',
        category: 'my-category-custom',
        supports: { html: false },

        attributes: {
            maxWidth: {
                type: 'number',
                default: 1140
            },
            titleStyle: {
                type: 'object',
                default: {}
            },

            contentStyle: {
                type: 'object',
                default: {}
            },

            items: {
                type: 'array',
                default: [
                    { content: 'コンテンツ' }
                ]
            }
        },

        example: {
            attributes: {
                items: [
                    {  content: 'コンテンツ' },
                    {  content: 'コンテンツ' }
                ]
            }
        },

        /* ================= EDIT ================= */
        edit({ attributes, setAttributes }) {
            const {
                title,
                titleStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            const updateItem = (index, key, value) => {
                const newItems = [...items];
                newItems[index] = { ...newItems[index], [key]: value };
                setAttributes({ items: newItems });
            };

            const addItem = () => {
                setAttributes({
                    items: [...items, { content: 'コンテンツ' }]
                });
            };

            const removeItem = (index) => {
                setAttributes({
                    items: items.filter((_, i) => i !== index)
                });
            };

            return el(
                Fragment,
                {},

                /* ===== Sidebar ===== */
                el(
                    InspectorControls,
                    {},

                    el(
                        PanelBody,
                        { title: 'Layout', initialOpen: true },
                        el(RangeControl, {
                            label: 'マックス幅（px）',
                            min: 375,
                            max: 1600,
                            step: 1,
                            value: maxWidth,
                            onChange: (v) => setAttributes({ maxWidth: v })
                        })
                    ),

                    renderTextStylePanel({
                        panelTitle: 'コンテンツスタイル',
                        style: contentStyle,
                        setAttributes,
                        attrKey: 'contentStyle',
                        fontSizeRange: { min: 12, max: 40 },
                        showLineHeight: true
                    })
                ),

                /* ===== Block ===== */
                el(
                    'div',
                    {
                        className: 'wp-block09',
                        style: {
                            maxWidth: maxWidth + 'px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }
                    },

                    el(
                        'div',
                        { className: 'wp-block09__inner' },

                        items.map((item, index) =>
                            el(
                                'div',
                                { className: 'wp-block09__item', key: index },

                                el(RichText, {
                                    tagName: 'div',
                                    className: 'wp-block09__content',
                                    value: item.content,
                                    style: contentStyle,
                                    onChange: (v) => updateItem(index, 'content', v),
                                }),

                                el(
                                    Button,
                                    {
                                        isSmall: true,
                                        isDestructive: true,
                                        onClick: () => removeItem(index),
                                        style: { marginTop: '6px' }
                                    },
                                    '削除'
                                )
                            )
                        ),

                        el(
                            Button,
                            {
                                isPrimary: true,
                                onClick: addItem,
                                style: { marginTop: '10px' }
                            },
                            '＋ アイテム追加'
                        )
                    )
                )
            );
        },

        /* ================= SAVE ================= */
        save({ attributes }) {
            const {
                title,
                titleStyle,
                contentStyle,
                maxWidth,
                items
            } = attributes;

            return el(
                'div',
                {
                    className: 'wp-block09',
                    style: {
                        maxWidth: maxWidth + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }
                },

                el(
                    'div',
                    { className: 'wp-block09__inner' },

                    items.map((item, index) =>
                        el(
                            'div',
                            { className: 'wp-block09__item', key: index },

                            el(RichText.Content, {
                                tagName: 'div',
                                className: 'wp-block09__content',
                                value: item.content,
                                style: contentStyle
                            })
                        )
                    )
                )
            );
        },
    });

})(window.wp);


