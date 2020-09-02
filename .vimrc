" Source a global configuration file if available
if filereadable("/etc/vim/vimrc.local")
  source /etc/vim/vimrc.local
endif


"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" General Setting
set mouse=a         " enable mouse usage (all mode)
set autowrite		" automatically save before commands like :next and :make
set encoding=utf-8
set shell=/bin/bash
" set lines=45 columns=190 " Initial size of VIM window (l45 c190:zoom)
" winpos 235 235           " Initial position of VIM window

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Edit Setting
" set spell spelllang=en_us   " spell checker
set undofile        " save undo in a extra file
set autochdir       " auto change the direction to where the current file is
set noerrorbells    " no bells for error
set history=1000    " the number of rembered undos
set list            " visual extra space at the end of line

" Color Setting
colorscheme default	" awesome colorscheme
syntax enable		" enable syntax processing
set background=light
set t_Co=256

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Space & Tabs Setting
set autoindent      " automatically indent following the pre-line
set smartindent
set tabstop=4		    " number of visual spaces per TAB
set softtabstop=4	  " number of spaces in tab when editing
set expandtab		    " tabs are spaces
set shiftwidth=4    	  " number of shift>> width

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" UI Setting
set number 		      " show line numbers
set scrolloff=5       " leave 5 lines between cursor and bottom
set showcmd		      " show command in bottom bar
set cursorline		" highlight current line 
filetype indent on	" load filetype-specific indent file
set wildmenu		    " visual autocomplete for command menu
set showmatch		    " highlight matching {[()]}
set wrap            " wrap when the current line is too long
set linebreak       " never wrap in a word
set wrapmargin=2    " set width next to right boundary
set ruler           " show the current lines and rows in bottom bar
set guifont=Fira\ Code\ Medium:h14
set listchars=tab:\ \ ,trail:·,eol:\ \,nbsp:_

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Searching Setting
set incsearch		    " search as characters are entered
set hlsearch        " highlight matches
set ignorecase      " ignore case when searching

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Folding Setting
set foldenable		" enable folding
set foldlevelstart=10   " open most folds by default
set foldmethod=indent   " fold based on indent level
  
"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Movement Setting

" move to beginning/end of line
nnoremap B ^
nnoremap E $

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Leader Shortcuts
let mapleader=" "

" jk is escape
inoremap jk <esc>

" set F9 to complie
nnoremap <silent> <F9> : call Compile()<CR>
" set F5 to run
nnoremap <silent> <leader>n : call Run()<CR>
" set F6 to debug
nnoremap <silent> <F6> : call Debug()<CR>

"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Plugins Manager
" VimPlug

" Specify a directory for plugins
call plug#begin('~/.vim/plugged')

" p.s. The lines with leading ! are EXAMPLES
" Shorthand notation; fetches https://github.com/junegunn/vim-easy-align
"!Plug 'junegunn/vim-easy-align'
" Any valid git URL is allowed
"!Plug 'https://github.com/junegunn/vim-github-dashboard.git'
" Multiple Plug commands can be written in a single line using | separators
"!Plug 'nsf/gocode', { 'tag': 'v.20150303', 'rtp': 'vim' }
" Plugin outside ~/.vim/plugged with post-update hook
"!Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
" Unmanaged plugin (manually installed and updated)
"!Plug '~/my-prototype-plugin'

" My Plugins
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

Plug 'zxqfl/tabnine-vim'
Plug 'scrooloose/syntastic'
Plug 'majutsushi/tagbar'

Plug 'kien/rainbow_parentheses.vim'
Plug 'airblade/vim-gitgutter'

Plug 'kana/vim-textobj-user'
Plug 'kana/vim-textobj-indent'
Plug 'kana/vim-textobj-syntax'
Plug 'kana/vim-textobj-function', { 'for':['c', 'cpp', 'vim', 'java'] }
Plug 'sgur/vim-textobj-parameter'


Plug 'scrooloose/nerdtree'

Plug 'vim-scripts/vim-auto-save'
Plug 'rhysd/accelerated-jk'

Plug 'christoomey/vim-tmux-navigator'
Plug 'edkolev/tmuxline.vim'

Plug 'tpope/vim-surround'

Plug 'jiangmiao/auto-pairs'
Plug 'lervag/vimtex'
" Initialize plugin system
call plug#end()


" Plugin Configuration
" syntastic
execute pathogen#infect()
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
" NERDTree
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif   " if NERDTree is the only window, close it
nnoremap <silent> <leader>f : NERDTree<CR>

" RainbowParentheses
au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces

" tagbar
nmap <leader>t :TagbarToggle<CR>

" auto-save
let g:auto_save_silent = 1
autocmd FileType markdown let g:auto_save

" gitgutter
let g:gitgutter_map_keys = 0
set updatetime=1000 "ms

nmap j <Plug>(accelerated_jk_gj)
nmap k <Plug>(accelerated_jk_gk)

" vimtex
set completeopt=menu,preview
let g:vimtex_view_method = 'zathura'
let g:tex_flavor = 'latex'

let &rtp = '~/.vim/plugged/vimtex,' . &rtp
let &rtp = '~/.vim/plugged/vimtex/after,' . &rtp
let g:vimtex_quickfix_open_on_warning = 0
nnoremap <leader><leader>f
    \ :exec "!szathura %:r.pdf" line('.')  col('.') "% > /dev/null"<cr><cr>
nnoremap <leader><leader>F
    \ :exec "!szathura %:r.pdf" > /dev/null 2>&1 &"<cr><cr>
"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
" Functioins
function! Compile()
  exec "w"
  if &filetype == "cpp" || &filetype == "cc"
    exec "!g++ % -g -o %<"
  elseif &filetype == "c"
    exec "!gcc % -g -o %<"
  elseif &filetype == "python"
    exec "!time python3 %"
  elseif &filetype == "tex"
    exec "VimtexCompile"
  endif
endfunction

function! Run()
  if &filetype == "cpp" || &filetype == "cc" || &filetype == "c"
    exec "!time ./%<"
  elseif &filetype == "python"
    exec "w"
    exec "!time python3 %"

  endif
endfunction

function! Debug()
  if &filetype == "cpp" || &filetype == "cc" || &filetype == "c"
    exce "!gdb %<"
  elseif &filetype == "py"
    exce ""
  endif
endfunction
    
"新建.c,.h,.sh,.py文件，自动插入文件头
autocmd BufNewFile  *.[ch],*.hpp,*.cpp,Makefile,*.mk,*.sh,*.py exec ":call SetTitle()"
""定义函数SetTitle，自动插入文件头
function! SetTitle()
    if &filetype == 'sh'
        call setline(1,"\#########################################################################")
        call append(line("."), "\# File Name: ".expand("%"))
        call append(line(".")+1, "\# @Author: pisceskkk")
        call append(line(".")+2, "\# Created Time: ".strftime("%c"))
        call append(line(".")+3, "\#########################################################################")
        call append(line(".")+4, "\#!/bin/bash")
        call append(line(".")+5, "")
    elseif &filetype == 'cpp' || &filetype == 'c'
        call setline(1, "/*************************************************************************")
        call append(line("."), "    > File Name: ".expand("%"))
        call append(line(".")+1, "    > @Author: pisceskk")
        call append(line(".")+2, "    > Created Time: ".strftime("%c"))
        call append(line(".")+3, " ************************************************************************/")
        call append(line(".")+4, "")
        
        if &filetype == 'cpp'
            call append(line(".")+5, "#include<bits/stdc++.h>")
            call append(line(".")+6, "using namespace std;")
            call append(line(".")+7, "")
        endif

        if &filetype == 'c'
            call append(line(".")+6, "#include<stdio.h>")
            call append(line(".")+7, "")
        endif
    elseif &filetype == 'python'
        call setline(1, "#***********************************************************************")
        call append(line("."), "#   > File Name: ".expand("%"))
        call append(line(".")+1, "#   > @Author: pisceskk")
        call append(line(".")+2, "#   > Created Time: ".strftime("%c"))
        call append(line(".")+3, "#************************************************************************")
        call append(line(".")+4, "")
    endif
    "新建文件后，自动定位到文件末尾
endfunction


