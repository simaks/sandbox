import "js-polyfills";
import * as jQuery from "jquery";
(<any>window).jQuery = jQuery;
import * as Tether from 'tether';
(<any>window).Tether = Tether;
import "bootstrap";

import { Category } from './script/Category';

let catTree = new Category('Lorem', [
    new Category('Ipsum'),
    new Category('Dolor', [
        new Category('Orci', [
            new Category('Quis', [
                new Category('Odio')
            ])
        ])
    ]),
    new Category('Sit', [
        new Category('Amet'),
        new Category('Consectetur'),
    ]),
    new Category('Adipiscing', [
        new Category('Elit', [
            new Category('Vestibulum'),
            new Category('Vitae'),
        ]),
    ]),
]);

function printCategoryTreeRecursive(tree: Category) {
    let childTree = document.createElement('ul');
    if (tree.children) {
        for (let child of tree.children) {
            childTree.appendChild(printCategoryTreeRecursive(child));
        }
    }

    let name = document.createElement('div');
    name.innerText = tree.name;
    name.classList.add('name');
    name['objectReference'] = tree;

    let listItem = document.createElement('li');
    listItem.appendChild(name);
    listItem.appendChild(childTree);

    return listItem;
}

// function printCategoryTreeIterative(tree: Category) {
//     let childTree = '';
//     if (tree.children) {
//         for (let child of tree.children) {
//             childTree += `${printCategoryTreeRecursive(child)}`;
//         }
//     }

//     return `<ul><li>${tree.name} ${childTree}</li></ul>`;
// }


let recursiveList = document.createElement('ul');
recursiveList.appendChild(printCategoryTreeRecursive(catTree));
let categoryTreeRecursive = document.getElementById('categoryTreeRecursive');
categoryTreeRecursive.appendChild(recursiveList);
//document.getElementById('categoryTreeIterative').innerHTML = printCategoryTreeIterative(catTree);

let newNodeForm = document.getElementById('newNodeForm');





let activeCategory: Category = null;
let newNodeType = document.getElementById('nodeType');
let newNodeName = document.getElementById('nodeName');


jQuery('.categoryTree').on('click', '.name', function() {
    console.log(jQuery(this).html());
    activeCategory = jQuery(this)[0]['objectReference'];
    console.log(activeCategory);
    newNodeForm.classList.remove('hidden-xs-up');
});

document.getElementById('submitBtn').addEventListener('click', (event) => {
    console.log(newNodeType['value']);
    event.preventDefault();

    if (!activeCategory.children) {
        activeCategory.children = [];
    }
    activeCategory.children.push(new Category(newNodeName['value']));
    console.log(activeCategory);
    // switch (newNodeType['value']) {
    //     case 'Neighbour':
    //     break;
    //     case 'Child':
    //     break; 
    // }
    activeCategory = null;
    categoryTreeRecursive.innerHTML = '';
    categoryTreeRecursive.appendChild(recursiveList);
    //newNodeForm.classList.add('hidden-xs-up');
});
