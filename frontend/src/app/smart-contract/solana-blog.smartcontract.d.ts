/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_blog.json`.
 */
export type SolanaBlog = {
  "address": "12dk1HZdLaKfcbTzVxLPg69ofa5v7Gj3AhjiVDN92pmF",
  "metadata": {
    "name": "solanaBlog",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPost",
      "discriminator": [
        123,
        92,
        184,
        29,
        231,
        24,
        15,
        202
      ],
      "accounts": [
        {
          "name": "postAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "blogAccount"
              },
              {
                "kind": "account",
                "path": "blog_account.current_post_key",
                "account": "blogState"
              }
            ]
          }
        },
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "blogAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  111,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "userAccount"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "initBlog",
      "discriminator": [
        251,
        119,
        6,
        126,
        110,
        166,
        6,
        245
      ],
      "accounts": [
        {
          "name": "blogAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  108,
                  111,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "signupUser",
      "discriminator": [
        205,
        73,
        147,
        4,
        21,
        37,
        15,
        229
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "avatar",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "blogState",
      "discriminator": [
        244,
        86,
        195,
        29,
        196,
        144,
        214,
        46
      ]
    },
    {
      "name": "postState",
      "discriminator": [
        9,
        48,
        119,
        167,
        221,
        165,
        87,
        106
      ]
    },
    {
      "name": "userState",
      "discriminator": [
        72,
        177,
        85,
        249,
        76,
        167,
        186,
        126
      ]
    }
  ],
  "events": [
    {
      "name": "postEvent",
      "discriminator": [
        202,
        76,
        109,
        82,
        10,
        176,
        42,
        87
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Name is too long."
    },
    {
      "code": 6001,
      "name": "avatarTooLong",
      "msg": "Avatar URL is too long."
    },
    {
      "code": 6002,
      "name": "titleTooLong",
      "msg": "Title is too long."
    },
    {
      "code": 6003,
      "name": "contentTooLong",
      "msg": "Content is too long."
    }
  ],
  "types": [
    {
      "name": "blogState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentPostKey",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "postEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "label",
            "type": "string"
          },
          {
            "name": "postId",
            "type": "pubkey"
          },
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "nextPostId",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "postState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "prePostKey",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "avatar",
            "type": "string"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
