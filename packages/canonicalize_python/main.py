#!/usr/bin/env python3
"""Canonicalize Python."""

from __future__ import annotations

import os
import unittest
from pathlib import Path

import fire
import libcst
import ssort


def _get_sort_key(node: libcst.FunctionDef) -> str:
    decorator_str = ""
    for decorator in node.decorators:
        dec = decorator.decorator
        if hasattr(dec, "value"):
            if hasattr(dec.value, "value"):
                decorator_str += dec.value.value
            elif isinstance(dec.value, str):
                decorator_str += dec.value
        elif (
            hasattr(dec, "func")
            and hasattr(dec.func, "value")
            and hasattr(dec.func.value, "value")
        ):
            decorator_str += dec.func.value.value
    if decorator_str:
        return f"@{decorator_str}{node.name.value}"
    node_name_value: str = node.name.value
    return node_name_value


class _CSTTransformer(libcst.CSTTransformer):  # type: ignore[misc]
    def leave_ClassDef(  # noqa: N802
        self,
        original_node: libcst.ClassDef,  # noqa: ARG002
        updated_node: libcst.ClassDef,
    ) -> libcst.ClassDef:
        statements = list(updated_node.body.body)
        if not statements:
            return updated_node
        function_nodes = []
        other_nodes = []
        for node in statements:
            if isinstance(node, libcst.FunctionDef):
                function_nodes.append(node)
            else:
                other_nodes.append(node)
        sorted_functions = sorted(function_nodes, key=_get_sort_key)
        init_index = -1
        for i, func_node in enumerate(sorted_functions):
            if func_node.name.value == "__init__":
                init_index = i
                break
        if init_index != -1:
            init_node = sorted_functions.pop(init_index)
            sorted_functions.insert(0, init_node)
        return updated_node.with_changes(
            body=updated_node.body.with_changes(
                body=tuple(other_nodes + sorted_functions),
            ),
        )

    def leave_Module(  # noqa: N802
        self,
        original_node: libcst.Module,  # noqa: ARG002
        updated_node: libcst.Module,
    ) -> libcst.Module:
        statements = list(updated_node.body)
        if not statements:
            return updated_node
        first_idx = -1
        class_and_func_nodes = []
        for i, node in enumerate(statements):
            if isinstance(node, (libcst.ClassDef, libcst.FunctionDef)):
                if first_idx == -1:
                    first_idx = i
                class_and_func_nodes.append(node)
        if first_idx == -1:
            return updated_node
        classes = [n for n in class_and_func_nodes if isinstance(n, libcst.ClassDef)]
        functions = [
            n for n in class_and_func_nodes if isinstance(n, libcst.FunctionDef)
        ]
        sorted_classes = sorted(classes, key=lambda n: n.name.value)
        sorted_functions = sorted(functions, key=_get_sort_key)
        new_statements = statements[:first_idx]
        new_statements.extend(sorted_classes)
        new_statements.extend(sorted_functions)
        for i in range(first_idx, len(statements)):
            node = statements[i]
            if not isinstance(node, (libcst.ClassDef, libcst.FunctionDef)):
                new_statements.append(node)
        return updated_node.with_changes(body=tuple(new_statements))


def canonicalize_python(*args: str | bytes) -> str | bytes | None:
    """Canonicalize Python.

    It does the following:
    1. Sorts alphabetically classes and functions in that order.
    2. Exception is the __init__ method which is placed in the top.
    """
    for input_str_or_bytes in args:
        if isinstance(input_str_or_bytes, str):
            with Path(input_str_or_bytes).open() as file:
                cst = libcst.parse_module(file.read())
        else:
            cst = libcst.parse_module(input_str_or_bytes.decode())
        cst_transformer = _CSTTransformer()
        modified_tree = cst.visit(cst_transformer)
        code_unparsed: str = modified_tree.code
        code_unparsed = ssort.ssort(code_unparsed)
        if isinstance(input_str_or_bytes, str):
            with Path(input_str_or_bytes).open("w") as file:
                file.write(code_unparsed)
            if len(args) == 1:
                return None
        if len(args) == 1:
            return code_unparsed.encode()
    return None


class _TestCase(unittest.TestCase):
    def test_canonicalize_python_bytes_input(self) -> None:
        parent_path = Path(__file__).resolve().parent
        with (parent_path / "prm/main_before.py").open() as file:
            code_output_before = canonicalize_python(file.read().encode())
        with (parent_path / "prm/main_after.py").open() as file:
            code_output_after = file.read()
        if code_output_before.decode() != code_output_after:  # type: ignore[union-attr]
            raise AssertionError

    def test_canonicalize_python_empty_input(self) -> None:
        code_output_after = canonicalize_python(b"")
        if code_output_after != b"":
            raise AssertionError


def main() -> None:
    """Canonicalize Python."""
    fire.Fire(canonicalize_python)


if __name__ == "__main__":
    if os.getenv("DEBUG"):
        unittest.main()
    else:
        main()
