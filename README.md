# cheq

**A command-line checklist app**

![](https://imgur.com/W8IvOMf)

## About

This is a command-line checklist with a simple text-based UI for adding, listing, removing, tagging, checking and renaming checklist items.

### Installation

You can download cheq here on Github, or install from npm:

```
$ npm -i g cheq
```

## Functions

### list

```
cheq list <keyword>

// example
cheq list
cheq list all
cheq list tagged work
cheq list tagged work project1
cheq list checked
cheq list unchecked
```

The `list` function displays all of your checklist items by default. You can use the special keyword `all` to display a list of all checklist items, `tagged <terms>` to list only those checklist items that are tagged with one or more space separated tags, or `checked` or `unchecked` to display checklist items with a matching status.

### tag

```
cheq tag <id> <keyword>

// example
cheq tag 33n grocery
```

When using the `tag` function you supply the checklist item's ID along with the desired tag. Adding the same tag to a checklist item twice will remove that tag.

### add

```
cheq add <title>

// example
cheq add New Checklist Item
```

You can use the `add` function, followed by text to create a new checklist item of the same text. Don't worry, you can change this text for any existing item using the `rename` function.

### remove

```
cheq remove <keyword>
cheq remove <id>

// example
cheq remove all
cheq remove tagged work
cheq remove tagged work project1
cheq remove checked
cheq remove unchecked
cheq remove a3
```

Using the `remove` function we can remove individual checklist items by their ID, or sets of items matching keywords `all`, `tagged` with one or more tags supplied, `checked` or `unchecked`. This action is irreversible.

### check

```
cheq check <id>

// example
cheq check 4g
```

The `check` function changes the status of a checklist item so it shows as checked in the list. This function only accepts individual IDs.

### uncheck

```
cheq uncheck <id>

// example
cheq uncheck 5e
```

The `uncheck` function changes the status of a checklist item so it shows as unchecked in the list. This function only accepts individual IDs.

### rename

```
cheq rename <id> <title>

//example
cheq rename 15 New Title
```

The `rename` function takes the ID of an existing checklist item and replaces the current title with a new title.