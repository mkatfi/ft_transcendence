FILES =	"./docker-compose.yml"  \
		"./docker-compose.nginx.yml" \
		"./docker-compose.game.yml" \
		"./docker-compose.match_making.yml" \
		"./Tournament/docker-compose.yml" \
		"./Chat/docker-compose.yml" \

define run_compose_files1
    @for file in $(1); do \
        echo "Running -f $${file}"; \
		docker compose -f $$file $(2) $(3); \
    done
endef

define run_compose_files2
    @for file in $(1); do \
        echo "Running -f $${file}"; \
		docker compose -f $$file $(2); \
    done
endef

define run_compose_reversed
	@for file in $(shell echo $(1) | tr ' ' '\n' | tac); do \
		echo "Running docker compose $$file $(2)"; \
		docker compose -f "$$file" $(2); \
	done
endef

up:
	$(call run_compose_files1, $(FILES), "up", "-d")

down:
	$(call run_compose_reversed, $(FILES), "down")

restart:
	$(call run_compose_files2, $(FILES), "restart")

start:
	$(call run_compose_files2, $(FILES), "start")

stop:
	$(call run_compose_files2, $(FILES), "stop")

build:
	$(call run_compose_files2, $(FILES), "build")


vol:
	mkdir ~/Desktop/volumes 
	mkdir ~/Desktop/volumes/data
	mkdir ~/Desktop/volumes/game

