from typing import Callable, Any

from PyPDF2 import PdfReader

from ..config.settings import PAGES_PER_CHUNK


def extract_text_from_pages(pdf_reader: PdfReader, start_page: int, end_page: int) -> str:
    """Extract text from a range of pages in a PDF."""
    text = ""
    for page_num in range(start_page, end_page):
        try:
            page_text = pdf_reader.pages[page_num].extract_text()
            text += page_text
        except Exception as e:
            print(f"Error processing page {page_num}: {str(e)}")
            continue
    return text


def process_pdf_in_chunks(pdf_file, processor_function: Callable, **kwargs) -> Any:
    """Process a PDF file in chunks, applying the provided function to each chunk."""
    reader = PdfReader(pdf_file)
    try:
        total_pages = len(reader.pages)
        num_chunks = (total_pages + PAGES_PER_CHUNK - 1) // PAGES_PER_CHUNK
        accumulated_result = kwargs.get('initial_result', {})

        for i in range(num_chunks):
            start_page = i * PAGES_PER_CHUNK
            end_page = min((i + 1) * PAGES_PER_CHUNK, total_pages)

            chunk_text = extract_text_from_pages(reader, start_page, end_page)
            if not chunk_text:
                continue

            # Process this chunk of text with the provided function
            chunk_kwargs = kwargs.copy()
            chunk_kwargs['existing_result'] = accumulated_result
            chunk_result = processor_function(chunk_text, **chunk_kwargs)

            # Update accumulated result
            if isinstance(accumulated_result, dict) and isinstance(chunk_result, dict):
                accumulated_result.update(chunk_result)
            else:
                accumulated_result = chunk_result

            print(f'Processed chunk {i + 1}/{num_chunks}')

        return accumulated_result
    except Exception as e:
        print(f"Error reading PDF: {str(e)}")
        return {}
    finally:
        pdf_file.close()
