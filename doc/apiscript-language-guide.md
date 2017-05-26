
**Please note that the formatting of APIScript is likely to change
drastically over time!**

## APIScript  - Language Guide

The following guide can be used to get started developing with APIScript.
To begin we will go through the languages from the basics, feel free
to skip any sections that aren't relevant to you.

If you've read through this guide and want an example to look through,
check out the example repository.

**http://github.com/APIScript/Example-Script/tree/master/src**

## Basic

APIScript uses the extension .api for its files. A single entry point is
defined when parsing a script but code can be spread between multiple files
by using imports.

All code in the .api will be parsed except from comments. They can be defined
as either single line or multi-line comments.

```
// Single line comment

/* Multi-line comment
   This is skipped when
   parsing a script
*/
```

## API

In APIScript everything must be contained within an API closure.

```
api {
    //  Everything is contained within an API
}
```

An API by default has all the endpoints begin at **/api**. For example,
if you have an endpoint at the root of your API called account, then the
URL to access this would be **example.com/api/account**.

This can be configured as the API closure accepts a name to
modify this.

```
api myAPI {}
```

Using the previous example and specifying like shown, the URL would now be
**example.com/myAPI/account**.

## Group

Groups allow keeping sets of endpoints together under the same section
of a URL. An API is a group in itself. Anything you can do in a
group, you can do in an API.

Groups are defined in a similar way to APIs, although the name is
not optional in a group.

```
group v1 {}
```

Groups can be nested and can contain as many sub-groups as you want.

```
group v1 {
    group "account" {}
    group "social" {}
}
```

## Enum

An enum allows you to define a custom data type with a limit set of valid
values.

```
enum Privilege {
    CreateUser, DeleteUser, SetAdmin
}
```

## Entity

An entity allows you to define a custom data structure that can be referred
to in properties. All entities must be added in the root of the API closure.

Entities can contain a set of properties.

```
entity {
    name: string
    age: integer
}
```

Entities can inherit from other entities, allowing it to include its
properties.

```
entity User {
    id: integer
    name: string
}

// account has three properties, id, name and email
entity Account extends User {
    email: string
}
```

An entity can only inherit from a single entity and must not
already contain a property with the same name as the parent.

## Property

Properties are used in many places in APIScript. They are most commonly
used to define entities and endpoint parameters.

The most minimal property contains a name and a type, for example a
name property that is of type string would be defined as.

```
name: string    // simple property
```

All properties in a closure are required by default. If a property is not
always required, it can be set as optional.

```
name: string?   // optional property
```

Properties can also be given a default value. This is similar to the optional
setting as the property will no longer need to be defined. But with default
properties, when omitted it is assigned the specified value.

At current, only primitive properties can be given a default value. The
default setting can also not be combined with the optional setting.

```
name: string = "Cytren" // property with default value
```

### Types

APIScript comes with four built in primitive types. These are integer,
float, boolean and string. There is no extra precision types such as double
or long.

```
name: string
age: integer
height: float
isAdmin: boolean
```

Generators should use the type with the largest number of bits, for example
in Java the APIScript integer should be defined as a long. To specify
extra date types, create an entity or an enum.

```
user: Account
userAccess: Privilege
```

Both primitive types and custom types can be wrapped in a collection. A
collection allows defining more than one value per property.

There are three different collection types

 - List - Ordered collection of values, allows duplicates.
 - Set - Unordered collection of values, no duplicates allowed.
 - Map - Unordered collection of keys that points a value, keys must
 be unique.

```
friends: <Account>                  // set of friends
visitors: [Account]                 // list of visitors
emailToAccount: <string, integer>   // maps email addresses to accounts
```

### Constraints

Constraints can also be added to properties that are checked when creating
a entity or making an endpoint call. Constraints can currently only be used
on primitive property types.

```
// user must not be Cytren
user: string (user != "Cytren")
```

Multiple constraints can be placed on a property.

```
// height must be between 1.5 and 2.0
height: float (height >= 1.5 && height <= 2.0)
```

When constraints are used on optional / default types, they are only checked
when the property has been defined.

```
// age must be between 18 and 50 or not defined
age: integer? (age >= 18 && age <= 50)
```

A shortcut can be used to referencing the same field that is constraint.

```
// age must be between 18 and 50
age: integer (* >= 18 && * <= 50)
```

Other properties can be referenced in the same closure.

```
isAdmin: boolean
deleteAccount: integer (isAdmin) // must be an admin to specify user id to delete
```

## Endpoint

Endpoints are the calls made from clients to servers and the core of APIScript.
There are four types of endpoints, get, put, post and delete.

```
get something {}
put something {}
post something {}
delete something {}
```

The four types are the basic HTTP methods and should be used as appropriate.
An endpoint must be given a name, this must be unique within the group except
where using multiple request methods.

Just like an entity, an endpoint can contain a set of properties. These
properties are sent to the server when calling the endpoint.

```
// GET mydomain.com/api/something?id=xxxxxxx
get something {
    id: integer
}
```

Endpoints can expect the request body as an entity by using the requests
keyword.

```
// endpoint call must contain an account entity in the body
post account requests Account {}
```

An entity can also be returned in the response from the server

```
// endpoint returns an account entity to the client
get account returns Account {}
```

## Import

The import keyword is used from within a group to place APIScript code
from other files. The code is added in place of the import line and is
processed as if it was simply replaced

> File - entity.api

```
entity Account {
    name: string
}
```

> File - main.api

```
api {
    import entity     // account entity is added to main.api
}
```

## Inject

The inject keyword can be used followed by a property from within a group.
This make every endpoint in scope (within this group or sub-group) implement
this property without having to define it multiple times.

```
// property token injected into /account and /social/friends
api {
    inject token: string

    get account returns Account {}

    group social {
        get "friends" returns <User> {}
    }
}
```