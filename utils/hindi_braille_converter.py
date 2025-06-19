"""
Hindi to Braille conversion utility.
Supports Hindi text including vowels and matras (vowel signs).
"""

# Hindi to Braille mapping including consonants, vowels, and matras
HINDI_TO_BRAILLE = {
    # Vowels (Swar)
    'अ': '⠁',  # a
    'आ': '⠜',  # aa
    'इ': '⠊',  # i
    'ई': '⠔',  # ii
    'उ': '⠥',  # u
    'ऊ': '⠳',  # uu
    'ऋ': '⠗',  # ri
    'ए': '⠑',  # e
    'ऐ': '⠌',  # ai
    'ओ': '⠕',  # o
    'औ': '⠪',  # au
    
    # Consonants (Vyanjan)
    'क': '⠅',  # ka
    'ख': '⠨',  # kha
    'ग': '⠛',  # ga
    'घ': '⠣',  # gha
    'ङ': '⠒',  # nga
    
    'च': '⠉',  # cha
    'छ': '⠡',  # chha
    'ज': '⠚',  # ja
    'झ': '⠴',  # jha
    'ञ': '⠒',  # nya
    
    'ट': '⠞',  # ta
    'ठ': '⠺',  # tha
    'ड': '⠙',  # da
    'ढ': '⠮',  # dha
    'ण': '⠝',  # na
    
    'त': '⠞',  # ta
    'थ': '⠹',  # tha
    'द': '⠙',  # da
    'ध': '⠫',  # dha
    'न': '⠝',  # na
    
    'प': '⠏',  # pa
    'फ': '⠋',  # pha
    'ब': '⠃',  # ba
    'भ': '⠘',  # bha
    'म': '⠍',  # ma
    
    'य': '⠽',  # ya
    'र': '⠗',  # ra
    'ल': '⠇',  # la
    'व': '⠧',  # va
    'श': '⠩',  # sha
    'ष': '⠯',  # sha
    'स': '⠎',  # sa
    'ह': '⠓',  # ha
    
    # Matras (Vowel signs)
    'ा': '⠜',  # aa matra
    'ि': '⠊',  # i matra
    'ी': '⠔',  # ii matra
    'ु': '⠥',  # u matra
    'ू': '⠳',  # uu matra
    'ृ': '⠗',  # ri matra
    'े': '⠑',  # e matra
    'ै': '⠌',  # ai matra
    'ो': '⠕',  # o matra
    'ौ': '⠪',  # au matra
    
    # Numbers (Ank)
    '०': '⠚',  # 0
    '१': '⠁',  # 1
    '२': '⠃',  # 2
    '३': '⠉',  # 3
    '४': '⠙',  # 4
    '५': '⠑',  # 5
    '६': '⠋',  # 6
    '७': '⠛',  # 7
    '८': '⠓',  # 8
    '९': '⠊',  # 9
    
    # Special characters
    '।': '⠲',  # Devanagari danda (full stop)
    '॥': '⠲⠲',  # Double danda
    'ं': '⠰',  # Anusvara
    'ः': '⠱',  # Visarga
    '्': '⠈',  # Halant (virama)
    
    # Punctuation
    ' ': '⠀',  # Space
    '.': '⠲',
    ',': '⠂',
    '?': '⠦',
    '!': '⠖',
    ':': '⠒',
    ';': '⠆',
    '-': '⠤',
    '"': '⠦',
    "'": '⠄',
}

def hindi_text_to_braille(text):
    """
    Convert Hindi text to Braille characters.
    
    Args:
        text (str): The Hindi text to convert
        
    Returns:
        str: The Braille representation of the text
    """
    braille_text = ""
    
    for char in text:
        if char in HINDI_TO_BRAILLE:
            braille_text += HINDI_TO_BRAILLE[char]
        else:
            # If character not found, keep it as is or use default
            braille_text += char
    
    return braille_text

def get_detailed_hindi_braille_mapping(text):
    """
    Get a detailed mapping of each Hindi character to its Braille representation.
    
    Args:
        text (str): The Hindi text to convert
        
    Returns:
        list: A list of dictionaries with 'original' and 'braille' keys
    """
    mapping = []
    
    for char in text:
        if char == ' ':
            mapping.append({
                'original': 'space',
                'braille': '⠀'
            })
        elif char in HINDI_TO_BRAILLE:
            mapping.append({
                'original': char,
                'braille': HINDI_TO_BRAILLE[char]
            })
        else:
            mapping.append({
                'original': char,
                'braille': char  # Keep original if no mapping found
            })
    
    return mapping