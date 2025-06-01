import os
from PyPDF2 import PdfReader, PdfWriter
import shutil


def split_pdf_to_pages(file_field):
    """
    Splits a PDF into individual pages, handling Django FieldFile objects.

    Args:
        file_field: Django FieldFile object or path
    """
    # Handle Django FieldFile objects
    if hasattr(file_field, 'path'):
        input_pdf_path = file_field.path  # Get the actual file path
        file_name = os.path.basename(file_field.name)  # Get original filename
    else:
        input_pdf_path = file_field
        file_name = os.path.basename(file_field)

    # Create output directory (using a 'pages' subdirectory)
    output_dir = os.path.join(os.path.dirname(input_pdf_path), 'pages')
    # Check if directory exists
    if os.path.isdir(output_dir):
        # Delete directory and all its contents
        shutil.rmtree(output_dir)

    # Create a fresh directory
    os.makedirs(output_dir)

    # Get base filename without extension
    base_filename = os.path.splitext(file_name)[0]

    # Open the PDF file
    pdf = PdfReader(input_pdf_path)
    total_pages = len(pdf.pages)

    output_files = []

    # Loop through each page
    for page_num in range(total_pages):
        pdf_writer = PdfWriter()
        pdf_writer.add_page(pdf.pages[page_num])

        # Generate output filename
        output_filename = os.path.join(output_dir, f"{base_filename}_page_{page_num + 1}.pdf")

        # Write the page to a new PDF file
        with open(output_filename, 'wb') as output_file:
            pdf_writer.write(output_file)

        output_files.append({"page": page_num + 1, "file": output_filename})

    return {
        'total_pages': total_pages,
        'files': output_files
    }
