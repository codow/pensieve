
/**
 * 新的数据结构
 */
const pageDefine =
{
  // 页面数据模型，需要可以自定义和数据源绑定结合
  "model": {
    "formData": {
      "name": "王钰博",
      "fees": [],
      "contacts": []
    },
    "currentFee": null
  },
  "dataModels": [
    {
      "id": "default",
      "label": "默认",
      "bind": "",
      "data_type": "Object",
      "model_type": "custom",
      "fields": [
        {
          "id": "test",
          "label": "测试字段",
          "data_type": "String"
        }
      ]
    },
    {
      "id": "contract_info",
      "label": "合同信息",
      "bind": "contract_info",
      "data_type": "Object",
      "model_type": "metadata",
      "fields": [
        {
          "id": "contract_no",
          "label": "合同编号",
          "data_type": "String"
        },
        {
          "id": "contract_name",
          "label": "合同名称",
          "data_type": "String"
        }
      ]
    },
    {
      "id": "contract_detail",
      "label": "合同明细",
      "bind": "contract_info.contract_detail",
      "data_type": "Array",
      "model_type": "metadata",
      "fields": [
        {
          "id": "item",
          "field": "item",
          "label": "合同事项",
          "data_type": "String"
        },
        {
          "id": "amount_rate",
          "field": "item",
          "label": "费用占比",
          "data_type": "Number"
        }
      ]
    }
  ],
  "define": {
    "id": "page",
    "tag": "div",
    "text": "页面",
    "props": {
      "size": {
        "type": "String",
        "default": "small"
      }
    },
    "attributes": {},
    "events": {
      "mounted": "function () {this.$notify.success('加载完成')}"
    },
    "children": [
      {
        "id": "form",
        "tag": "el-form",
        "attributes": {
          "model": "#{formData}",
          "size": "#{size}",
          // 自定义样式，string、array、object
          "class": "padding__medium",
          // 自定义样式，string、array、object
          "style": "background-color: #efefef;"
        },
        "children": [
          {
            "tag": "el-form-item",
            "attributes": {
              "label": "姓名",
              "prop": "name"
            },
            "children": [
              {
                "tag": "el-input",
                "field": "formData.name"
              }
            ]
          },
          {
            "tag": "el-input",
            "field": "formData.age",
            "show_label": true,
            "attributes": {
              "disabled": "#{formData.name === '王钰博'}"
            },
            "attributes_label": {
              "label": "年龄",
              "prop": "age"
            }
          },
          {
            "tag": "el-form-item",
            "attributes": {
              "label": "联系人"
            },
            "children": [
              {
                "tag": "el-button",
                "text": "新增",
                "attributes": {
                  "icon": "el-icon-plus",
                  "plain": true
                },
                "events": {
                  "click": "#{handleContactAdd}"
                }
              }
            ]
          },
          {
            "tag": "el-form-item",
            "children": [
              {
                "tag": "el-card",
                "vfor": "#{(item, $index) in formData.contacts}",
                "key": "#{item.id || $index}",
                "_style": "margin-top: 20px;",
                "attributes": {},
                "children": {
                  "header": [
                    {
                      "tag": "span",
                      "text": "联系人",
                      "attributes": {
                        "slot": "header"
                      }
                    },
                    {
                      "tag": "el-button",
                      "text": "删除",
                      "_style": "float: right;",
                      "attributes": {
                        "plain": true,
                        "icon": "el-icon-delete"
                      },
                      "events": {
                        "click": {
                          "inline": true,
                          "callParams": "$index",
                          "method": "#{handleContactDelete}"
                        }
                      }
                    }
                  ],
                  "default": [
                    {
                      "tag": "el-row",
                      "children": [
                        {
                          "tag": "el-col",
                          "attributes": {
                            "span": 12
                          },
                          "children": [
                            {
                              "tag": "el-form-item",
                              "attributes": {
                                "label": "联系人"
                              },
                              "children": [
                                {
                                  "tag": "el-input",
                                  "field": "item.name"
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "tag": "el-col",
                          "attributes": {
                            "span": 12
                          },
                          "children": [
                            {
                              "tag": "el-form-item",
                              "attributes": {
                                "label": "联系电话"
                              },
                              "children": [
                                {
                                  "tag": "el-input",
                                  "field": "item.phone"
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            "tag": "el-form-item",
            "children": [
              {
                "id": "table",
                "tag": "el-table",
                "attributes": {
                  "data": "#{formData.fees}"
                },
                "children": [
                  {
                    "tag": "el-table-column",
                    "attributes": {
                      "label": "#",
                      "width": 60,
                      "type": "index"
                    }
                  },
                  {
                    "tag": "el-table-column",
                    "attributes": {
                      "label": "费用"
                    },
                    "children": {
                      "default": {
                        "params": "{ row }",
                        // 插槽内开启滚动条
                        "show_scrollbar": true,
                        // 插槽内增加滚动区域
                        "show_responsive_container": true,
                        "components": [
                          {
                            "tag": "el-input",
                            "field": "row.fee_name",
                            "alt": "#{row.fee_name}",
                            "inline": true,
                            "vif": "#{currentFee === row}",
                            "attributes": {
                              "placeholder": "物业费/水电费"
                            },
                            "events": {
                              "change": "#{handleFeeNameCange}"
                            }
                          }
                        ]
                      }
                    }
                  },
                  {
                    "tag": "el-table-column",
                    "attributes": {
                      "width": 140
                    },
                    "children": {
                      "header": [
                        {
                          "tag": "el-button",
                          "text": "新增",
                          "attributes": {
                            "type": "text",
                            "icon": "el-icon-plus"
                          },
                          "events": {
                            "click": "#{handleFeeAdd}"
                          }
                        }
                      ],
                      "default": {
                        "params": "{ row, $index }",
                        "components": [
                          {
                            "tag": "el-button",
                            "text": "编辑",
                            "attributes": {
                              "type": "text",
                              "icon": "el-icon-edit"
                            },
                            "events": {
                              "click": {
                                "inline": true,
                                "callParams": "row, $index",
                                "method": "#{handleFeeEdit}"
                              }
                            }
                          },
                          {
                            "tag": "el-button",
                            "text": "删除",
                            "attributes": {
                              "type": "text",
                              "icon": "el-icon-delete"
                            },
                            "events": {
                              "click": {
                                "inline": true,
                                "callParams": "$index",
                                "method": "#{handleFeeDelete}"
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            "tag": "el-form-item",
            "attributes": {},
            "children": [
              {
                "tag": "el-button",
                "text": "提交",
                "attributes": {},
                "events": {
                  "click": "#{save}"
                }
              },
              {
                "tag": "el-button",
                "text": "随机名称",
                "attributes": {},
                "events": {
                  "click": "#{handleNameRandom}"
                }
              }
            ]
          }
        ]
      }
    ],
    "methods": {
      "save": "function () {\n  console.log('save', JSON.stringify(this.formData))\n}",
      "handleFeeNameCange": "function() { console.log('handleFeeNameCange', ...arguments) }",
      "handleFeeAdd": "function () { this.formData.fees.push({ id: this.$utils.string.uuid(), fee_name: '物业费' }) }",
      "handleFeeEdit": "function (row, $index) { this.currentFee = row }",
      "handleFeeDelete": "function ($index) { this.formData.fees.splice($index, 1) } ",
      "handleNameRandom": "function () { this.formData.name = Math.floor(Math.random() * 1000 + 1000) } ",
      "handleContactAdd": "function () { this.formData.contacts.push({ id: this.$utils.string.uuid() }) }",
      "handleContactDelete": "function ($index) { this.formData.contacts.splice($index, 1) } "
    },
    "meta": {}
  }
}